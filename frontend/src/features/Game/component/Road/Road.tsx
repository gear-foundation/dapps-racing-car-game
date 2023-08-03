import { LegacyRef, MutableRefObject, Ref, memo, useCallback, useEffect, useRef, useState } from 'react';
import { withoutCommas } from '@gear-js/react-hooks';
import isEqual from 'lodash.isequal';
import styles from './Road.module.scss';
import { cx } from '@/utils';
import startSVG from '@/assets/icons/game-start-icon.svg';
import finishSVG from '@/assets/icons/game-finish-icon.svg';
import roadLineSVG from '@/assets/icons/road-line-svg.svg';
import sectionEndLineSVG from '@/assets/icons/section-end-line.svg';

import { ReactComponent as PlayerCarSVG } from '@/assets/icons/player-car-icon.svg';
import { ReactComponent as ContractCarSVG } from '@/assets/icons/contract-car-icon.svg';

import smokeGIF from '@/assets/icons/gif-smoke.gif';
import speedGIF from '@/assets/icons/gif-speed.gif';
import { CarEffect, CarsState, RoadProps } from './Road.interface';
import { Cars } from '@/types';
import { Loader } from '@/components';

function RoadComponent({ newCars, carIds }: RoadProps) {
  const carDistanceFromInit = 160;
  const roadDistanceToStart = 300;

  const [cars, setCars] = useState<CarsState | null>(null);
  const [isRoadAssetsLoaded, setIsRoadAssetsLoaded] = useState<boolean>(false);

  const canvasRoadRef: LegacyRef<HTMLCanvasElement> = useRef(null);
  const roadRef: Ref<HTMLDivElement> = useRef(null);
  const imagesCollection: MutableRefObject<Record<string, HTMLImageElement>> = useRef({});

  const loadImageSync = (src: string) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject();
      img.src = src;
      imagesCollection.current[src] = img;
    });

  const loadRoadAssets = async () => {
    await loadImageSync(startSVG);
    await loadImageSync(finishSVG);
    await loadImageSync(roadLineSVG);
    await loadImageSync(sectionEndLineSVG);

    setIsRoadAssetsLoaded(true);
  };

  useEffect(() => {
    loadRoadAssets();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defineCarEffect = (roundResult: Record<string, string> | null): CarEffect => {
    if (roundResult) {
      if (Object.keys(roundResult)[0] === 'SlowedDown') {
        return 'shooted';
      }

      if (Object.keys(roundResult)[0] === 'Accelerated') {
        return 'accelerated';
      }
    }

    return null;
  };

  const drawSegment = (ctx: CanvasRenderingContext2D, segmentNumber: number, roadStart: number) => {
    const stripes = imagesCollection.current[roadLineSVG];
    const sectionEndLine = imagesCollection.current[sectionEndLineSVG];
    const segmentWidth = 156;
    const segmentHeight = 264;
    const renderStart = segmentNumber * segmentWidth + roadStart;

    ctx.fillStyle = 'transparent';

    ctx.fillRect(renderStart, 0, segmentWidth, segmentHeight);

    ctx.drawImage(stripes, renderStart, (segmentHeight * 1) / 3);
    ctx.drawImage(stripes, renderStart, (segmentHeight * 2) / 3);

    ctx.drawImage(sectionEndLine, renderStart + segmentWidth, 11);
    ctx.drawImage(sectionEndLine, renderStart + segmentWidth, segmentHeight - 10 - sectionEndLine.height);

    ctx.fillStyle = '#C5C5C5';

    ctx.fillText(String(segmentNumber + 1), renderStart + segmentWidth - 20, 22);
    ctx.fillText(String(segmentNumber + 1), renderStart + segmentWidth - 20, segmentHeight - 14);
  };

  const initRoad = useCallback(() => {
    if (isRoadAssetsLoaded) {
      const roadCtx = canvasRoadRef.current?.getContext('2d');
      const sections = Array(20)
        .fill(0)
        .map((_, i) => i);

      if (roadCtx) {
        const startLine = imagesCollection.current[startSVG];
        const finishLine = imagesCollection.current[finishSVG];

        roadCtx.drawImage(startLine, roadDistanceToStart, (264 - startLine.height) / 2);

        sections.forEach((item) => {
          drawSegment(roadCtx, item, roadDistanceToStart + startLine.width + 15);
        });

        roadCtx.drawImage(
          finishLine,
          roadDistanceToStart + startLine.width + 30 + sections.length * 156,
          (264 - startLine.height) / 2,
        );
      }
    }
  }, [isRoadAssetsLoaded]);

  const initCars = () => {
    const carPositionsY = [108, 30, 185];

    const carsToState: CarsState = carIds.reduce(
      (acc, id, i) => ({
        ...acc,
        [id]: {
          ...newCars[id],
          speed: Number(withoutCommas(newCars[id].speed)),
          position: Number(withoutCommas(newCars[id].position)) + carDistanceFromInit,
          positionY: carPositionsY[i],
          effect: defineCarEffect(newCars[id].roundResult),
        },
      }),
      {},
    );

    setCars(carsToState);
  };

  const updateCars = (newCarsToUpdate: Cars) => {
    carIds.forEach((id) => {
      setCars((prev) =>
        prev
          ? {
              ...prev,
              [id]: {
                ...prev[id],
                speed: Number(withoutCommas(newCars[id].speed)),
                position: Number(withoutCommas(newCarsToUpdate[id].position)) + carDistanceFromInit,
                effect: defineCarEffect(newCarsToUpdate[id].roundResult),
              },
            }
          : null,
      );
    });
  };

  const correctFocusOnPlayerCar = useCallback(() => {
    const roadCtx = canvasRoadRef.current?.getContext('2d');

    if (roadCtx && cars) {
      if (cars?.[carIds[0]]) {
        if (cars?.[carIds[0]].position > window.screen.width / 2) {
          roadRef.current?.scrollTo({ left: cars[carIds[0]].position - window.screen.width / 2, behavior: 'smooth' });
        } else {
          roadRef.current?.scrollTo({ left: 0 });
        }
      }
    }
  }, [cars, carIds]);

  useEffect(() => {
    initRoad();
  }, [initRoad]);

  useEffect(() => {
    if (isRoadAssetsLoaded) {
      if (!cars) {
        initCars();
      }

      if (cars) {
        updateCars(newCars);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCars, isRoadAssetsLoaded]);

  useEffect(() => {
    correctFocusOnPlayerCar();
  }, [correctFocusOnPlayerCar]);

  return (
    <div>
      {isRoadAssetsLoaded ? (
        <div className={cx(styles.road)} ref={roadRef}>
          <canvas ref={canvasRoadRef} width={4000} height={264} className={cx(styles['road-canvas'])} />
          {cars && (
            <>
              {carIds.map((id, i) => (
                <div
                  key={id}
                  style={{
                    transform: `translateX(${cars[id].position}px)`,
                    top: `${cars[id].positionY}px`,
                  }}
                  className={cx(styles.car)}>
                  {cars[id].effect && (
                    <img
                      src={cars[id].effect === 'shooted' ? smokeGIF : speedGIF}
                      alt="smoke"
                      className={cx(styles['car-effect'], styles[`car-effect-${cars[id].effect}`])}
                    />
                  )}
                  {i === 0 ? <PlayerCarSVG /> : <ContractCarSVG />}
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

const Road = memo(RoadComponent, isEqual);

export { Road };
