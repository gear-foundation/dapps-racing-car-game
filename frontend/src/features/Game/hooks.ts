import { useMemo } from 'react';
import { useSendMessage } from '@gear-js/react-hooks';
import { ADDRESS } from '@/consts';
import { useMetadata } from '@/hooks';
import metaTxt from '@/assets/meta/meta.txt';

function useCreateStreamMetadata() {
  const meta = useMetadata(metaTxt);

  const memoizedMeta = useMemo(() => meta, [meta]);

  return memoizedMeta;
}

function usePlayerMoveMessage() {
  const meta = useCreateStreamMetadata();

  return useSendMessage(ADDRESS.CONTRACT, meta, {
    disableAlerts: true,
  });
}

function useStartGameMessage() {
  const meta = useCreateStreamMetadata();

  const message = useSendMessage(ADDRESS.CONTRACT, meta, {
    disableAlerts: true,
  });

  return { meta, message };
}

export { usePlayerMoveMessage, useStartGameMessage };
