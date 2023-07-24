import { LegacyRef, Ref, memo, useCallback, useEffect, useRef, useState } from 'react';
import { withoutCommas } from '@gear-js/react-hooks';
import isequal from 'lodash.isequal';
import styles from './Road.module.scss';
import { cx } from '@/utils';
import startSVG from '@/assets/icons/game-start-icon.svg';
import finishSVG from '@/assets/icons/game-finish-icon.svg';
import roadLineSVG from '@/assets/icons/road-line-svg.svg';
import sectionEndLineSVG from '@/assets/icons/section-end-line.svg';
import contractCarSVG from '@/assets/icons/contract-car-icon.svg';
import playerCarSVG from '@/assets/icons/player-car-icon.svg';
import { CarsState, RoadProps } from './Road.interface';
import { Cars } from '@/types';

function RoadComponent({ newCars, carIds }: RoadProps) {
  const carDistanceFromInit = 160;
  const roadDistanceToStart = 300;

  const [cars, setCars] = useState<CarsState | null>(null);

  const canvasRoadRef: LegacyRef<HTMLCanvasElement> = useRef(null);
  const canvasCarsRef: LegacyRef<HTMLCanvasElement> = useRef(null);
  const roadRef: Ref<HTMLDivElement> = useRef(null);

  const drawSegment = (ctx: CanvasRenderingContext2D, segmentNumber: number, roadStart: number) => {
    const segmentWidth = 156;
    const segmentHeight = 264;
    const renderStart = segmentNumber * segmentWidth + roadStart;

    ctx.fillStyle = 'transparent';

    ctx.fillRect(renderStart, 0, segmentWidth, segmentHeight);

    const stripes = new Image();
    stripes.onload = () => {
      ctx.drawImage(stripes, renderStart, (segmentHeight * 1) / 3);
      ctx.drawImage(stripes, renderStart, (segmentHeight * 2) / 3);
    };
    stripes.src = roadLineSVG;

    const sectionEndLine = new Image();
    sectionEndLine.onload = () => {
      ctx.drawImage(sectionEndLine, renderStart + segmentWidth, 11);
      ctx.drawImage(sectionEndLine, renderStart + segmentWidth, segmentHeight - 10 - sectionEndLine.height);
    };
    sectionEndLine.src = sectionEndLineSVG;

    ctx.fillStyle = '#C5C5C5';

    ctx.fillText(String(segmentNumber + 1), renderStart + segmentWidth - 20, 22);
    ctx.fillText(String(segmentNumber + 1), renderStart + segmentWidth - 20, segmentHeight - 14);
  };

  const initRoad = useCallback(() => {
    const roadCtx = canvasRoadRef.current?.getContext('2d');
    const sections = Array(20)
      .fill(0)
      .map((_, i) => i);

    if (roadCtx) {
      const startLine = new Image();
      startLine.onload = () => {
        roadCtx.drawImage(startLine, roadDistanceToStart, (264 - startLine.height) / 2);
      };
      startLine.src = startSVG;

      sections.forEach((item) => {
        drawSegment(roadCtx, item, roadDistanceToStart + startLine.width + 15);
      });

      const finishLine = new Image();
      finishLine.onload = () => {
        roadCtx.drawImage(
          finishLine,
          roadDistanceToStart + startLine.width + 30 + sections.length * 156,
          (264 - startLine.height) / 2,
        );
      };
      finishLine.src = finishSVG;
    }
  }, []);

  const initCars = (ctx: CanvasRenderingContext2D, carPositionsY: number[]) => {
    const carsToState: CarsState = carIds.reduce(
      (acc, id, i) => ({
        ...acc,
        [id]: {
          ...newCars[id],
          position: Number(withoutCommas(newCars[id].position)) + carDistanceFromInit,
          positionY: carPositionsY[i],
        },
      }),
      {},
    );

    const playerCar = new Image();
    playerCar.onload = () => {
      carIds.forEach((id, i) => {
        if (i === 0) {
          ctx.drawImage(playerCar, carsToState[id].position, carPositionsY[i]);
        }
      });
    };
    playerCar.src = playerCarSVG;

    const contractCar = new Image();
    contractCar.onload = () => {
      carIds.forEach((id, i) => {
        if (i !== 0) {
          ctx.drawImage(contractCar, carsToState[id].position, carPositionsY[i]);
        }
      });
    };
    contractCar.src = contractCarSVG;

    setCars(carsToState);
  };

  const updateCars = (ctx: CanvasRenderingContext2D, currentCars: CarsState, newCarsToUpdate: Cars) => {
    const playerCar = new Image();

    playerCar.onload = () => {
      carIds.forEach((id, i) => {
        if (i === 0) {
          let carX = currentCars[id].position;

          const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, currentCars[id].positionY, 4000, 75);
            ctx.drawImage(playerCar, carX, currentCars[id].positionY);
            if (carX < Number(withoutCommas(newCarsToUpdate[id].position)) + carDistanceFromInit) {
              carX += 5;
            }
          };
          animate();
        }

        setCars((prev) =>
          prev
            ? {
                ...prev,
                [id]: {
                  ...prev[id],
                  position: Number(withoutCommas(newCarsToUpdate[id].position)) + carDistanceFromInit,
                },
              }
            : null,
        );
      });
    };

    playerCar.src = playerCarSVG;

    const contractCar = new Image();

    contractCar.onload = () => {
      carIds.forEach((id, i) => {
        if (i !== 0) {
          let carX = currentCars[id].position;

          const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, currentCars[id].positionY, 4000, 75);
            ctx.drawImage(contractCar, carX, currentCars[id].positionY);
            if (carX < Number(withoutCommas(newCarsToUpdate[id].position)) + carDistanceFromInit) {
              carX += 5;
            }
          };
          animate();
        }

        setCars((prev) =>
          prev
            ? {
                ...prev,
                [id]: {
                  ...prev[id],
                  position: Number(withoutCommas(newCarsToUpdate[id].position)) + carDistanceFromInit,
                },
              }
            : null,
        );
      });
    };

    contractCar.src = contractCarSVG;
  };

  const correctFocusOnPlayerCar = useCallback(() => {
    const roadCtx = canvasRoadRef.current?.getContext('2d');
    const carsCtx = canvasCarsRef.current?.getContext('2d');

    if (roadCtx && carsCtx && cars) {
      if (cars?.[carIds[0]] && cars?.[carIds[0]].position > window.screen.width / 2) {
        roadRef.current?.scrollTo({ left: cars[carIds[0]].position - window.screen.width / 2, behavior: 'smooth' });
      }
    }
  }, [cars, carIds]);

  useEffect(() => {
    initRoad();
  }, [initRoad]);

  useEffect(() => {
    const carCtx = canvasCarsRef.current?.getContext('2d');
    const carsPositionsY = [108, 30, 185];

    if (carCtx) {
      if (!cars) {
        initCars(carCtx, carsPositionsY);
      }

      if (cars) {
        updateCars(carCtx, cars, newCars);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCars]);

  useEffect(() => {
    correctFocusOnPlayerCar();
  }, [correctFocusOnPlayerCar]);

  return (
    <div>
      <div className={cx(styles.road)} ref={roadRef}>
        <canvas ref={canvasRoadRef} width={4000} height={264} className={cx(styles['road-canvas'])} />
        <canvas ref={canvasCarsRef} width={4000} height={264} className={cx(styles['cars-canvas'])} />
      </div>
    </div>
  );
}

const Road = memo(RoadComponent, isequal);

export { Road };
