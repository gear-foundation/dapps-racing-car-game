import { useEffect, useState, MutableRefObject, RefObject, useCallback, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ProgramMetadata, StateMetadata, getStateMetadata, MessagesDispatched } from '@gear-js/api';
import { useAccount, useAlert, useApi, useReadFullState } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { AnyJson } from '@polkadot/types/types';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import metaTxt from '@/assets/meta/meta.txt';
import { ACCOUNT_ID_LOCAL_STORAGE_KEY, ADDRESS, LOCAL_STORAGE, SEARCH_PARAMS } from '@/consts';
import { Handler, INodeSection, ProgramStateRes } from '@/types';
import { CONTRACT_ADDRESS_ATOM, nodesAtom } from '@/atoms';
import { WALLET_ID_LOCAL_STORAGE_KEY } from './features/Wallet/consts';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from './features/Auth/consts';
import { get } from './utils';

const postState = async (stateName: any, body: AnyJson) =>
  fetch(`https://state-machine.vara-network.io/state/races/${stateName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(body),
  });

function useReadStateFromApi<T = AnyJson>(
  programId: HexString | undefined,
  meta: ProgramMetadata | undefined,
  payload: AnyJson = '0x',
  isReadOnError?: boolean,
) {
  const { api } = useApi();
  const alert = useAlert();
  const { account } = useAccount();

  const [state, setState] = useState<T>();
  const [isStateRead, setIsStateRead] = useState(true);
  const [error, setError] = useState('');

  const isPayload = payload !== undefined;

  const readStateFromApi = async (isInitLoad?: boolean) => {
    if (!account) return;

    if (isInitLoad) setIsStateRead(false);

    try {
      const res = await postState(payload, {
        address: account?.decodedAddress,
      });

      const data = await res.json();

      setState(data as T);
      if (!isReadOnError) setIsStateRead(true);
    } catch ({ message }: any) {
      setError(message as any);
    } finally {
      if (isReadOnError) setIsStateRead(true);
    }
  };

  const handleStateChange = async ({ data }: MessagesDispatched) => {
    const changedIDs = data.stateChanges.toHuman() as HexString[];
    const isAnyChange = changedIDs.some((id) => id === programId);

    if (isAnyChange) {
      readStateFromApi();
    }
  };

  useEffect(() => {
    if (!api || !programId || !meta || !isPayload) return;

    const unsub = api.gearEvents.subscribeToGearEvent('MessagesDispatched', handleStateChange);

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, programId, meta, payload, account]);

  useEffect(() => {
    readStateFromApi(true);
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, programId, meta, payload, account]);

  useEffect(() => {
    if (error) alert.error(error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return { state, isStateRead, error };
}

export function useProgramMetadata(source: string) {
  const alert = useAlert();

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    fetch(source)
      .then((response) => response.text())
      .then((raw) => ProgramMetadata.from(`0x${raw}`))
      .then((result) => setMetadata(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return metadata;
}

export function useContractAddress() {
  const [address] = useAtom(CONTRACT_ADDRESS_ATOM);

  return address;
}

export function useContractAddressSetup() {
  const [searchParams, setSearchParams] = useSearchParams();

  const address = useContractAddress();

  useEffect(() => {
    if (!address) return;

    localStorage.setItem(LOCAL_STORAGE.CONTRACT_ADDRESS, address);

    searchParams.set(SEARCH_PARAMS.MASTER_CONTRACT_ID, address);
    setSearchParams(searchParams);
  }, [address, searchParams, setSearchParams]);
}

export function useClickOutside(
  handler: Handler,
  ...refs: (RefObject<HTMLElement> | MutableRefObject<HTMLElement>)[]
): void {
  useEffect(() => {
    const listener = (event: Event): void => {
      const existingRefs = refs.filter((item) => item?.current && item);

      const res = existingRefs.every((item) => !item.current?.contains(<Node>event.target));

      if (res) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);

    return (): void => {
      document.removeEventListener('mousedown', listener);
    };
  }, [refs, handler]);
}

export function useStateMetadata(source: string) {
  const alert = useAlert();

  const [stateMetadata, setStateMetadata] = useState<StateMetadata>();

  useEffect(() => {
    fetch(source)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => Buffer.from(arrayBuffer))
      .then((buffer) => getStateMetadata(buffer))
      .then((result) => setStateMetadata(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return stateMetadata;
}

export function useMediaQuery(width: number) {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(`(max-width:${width}px)`);
      media.addEventListener('change', updateTarget);

      if (media.matches) {
        setTargetReached(true);
      }

      return () => media.removeEventListener('change', updateTarget);
    }
  }, [updateTarget, width]);

  return targetReached;
}

export function useProgramState<T>(payload?: AnyJson) {
  const programId = ADDRESS.CONTRACT;
  const meta = useProgramMetadata(metaTxt);
  const state: ProgramStateRes<T> = useReadStateFromApi(programId, meta, payload);

  return state;
}

export function useReadState<T>({
  programId,
  meta,
  payload,
}: {
  programId?: HexString;
  meta: string;
  payload?: AnyJson;
}) {
  const metadata = useProgramMetadata(meta);
  return useReadStateFromApi<T>(programId, metadata, payload);
}

export function useLoginByParams() {
  const { search } = useLocation();
  const { login, accounts } = useAccount();

  const query = useMemo(() => new URLSearchParams(search), [search]);

  useEffect(() => {
    const isAccount = localStorage.getItem(ACCOUNT_ID_LOCAL_STORAGE_KEY);
    const isWallet = localStorage.getItem(WALLET_ID_LOCAL_STORAGE_KEY);
    const isAuthToken = localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY);

    if (query.size) {
      const account = query.get(ACCOUNT_ID_LOCAL_STORAGE_KEY);
      const wallet = query.get(WALLET_ID_LOCAL_STORAGE_KEY);
      const authToken = query.get(AUTH_TOKEN_LOCAL_STORAGE_KEY);

      const isEmptyStorage = !isAuthToken && !isAccount && !isWallet;
      const isSameUser = isAccount === account;
      const isDataCorrect = account && authToken && wallet;

      if ((isEmptyStorage || !isSameUser) && !!isDataCorrect) {
        localStorage.setItem(ACCOUNT_ID_LOCAL_STORAGE_KEY, account);
        localStorage.setItem(WALLET_ID_LOCAL_STORAGE_KEY, wallet);
        localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, authToken);

        const candidate = accounts.find((a) => a.address === account);
        if (candidate) login(candidate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, query]);
}

export function useNodes() {
  const nodes = useAtomValue(nodesAtom);
  const setNodes = useSetAtom(nodesAtom);

  return { nodes, setNodes };
}

export function useNodesSync() {
  const alert = useAlert();
  const { setNodes } = useNodes();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const getNodes = async () => {
      try {
        const res1 = await get<INodeSection[]>(ADDRESS.BASE_NODES);
        const res2 = await get<INodeSection[]>(ADDRESS.STAGING_NODES);
        const merged = [...res1, ...res2].map((n) => n.nodes.map((node) => ({ ...node, caption: n.caption }))).flat();

        const nodes = [...new Map(merged.map((o) => [o.address, o])).values()];

        setNodes(nodes);
        // console.log({ nodes })
      } catch (e) {
        alert.error((e as any).message);
      } finally {
        setLoading(false);
      }
    };
    getNodes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
