import { Cell, Row, Table } from '@ui';
import styles from './LeaderBoard.module.scss';
import { cx } from '@/utils';
import { CellValue, TableRow } from '@/ui/Table/Table.interfaces';
import { ScorePPV } from '@/features/ScoreBalance/components/ScorePPV';

const columns = ['#', 'Name and wallet', 'Victories', 'Success Rate', 'Total points'];

const rows = [
  {
    id: '0x256u...1Uhs',
    '#': 1,
    'Name and wallet': 'John Bin (0x256u...1Uhs)',
    Victories: 23,
    'Success Rate': `${58.04}%`,
    'Total points': 320.34,
  },
];

const handleCellClassname = (column: string) => {
  if (column === '#') {
    return cx(styles['cell-place']);
  }

  if (column === 'Total points') {
    return cx(styles['cell-total-points']);
  }

  if (column === 'Victories' || column === 'Success Rate') {
    return cx(styles['cell-number']);
  }

  return '';
};

const handleRenderCell = (column: string, cell: CellValue) => {
  if (column === 'Total points') {
    return <ScorePPV>{String(cell)}</ScorePPV>;
  }

  return cell;
};

const handleRenderSummary = (currentData: TableRow[]) => (
  <Row className={cx(styles['cell-summary'])}>
    {Object.keys(currentData[0])
      .filter((cellName) => columns.includes(cellName))
      .map((cellName: string) => (
        <Cell className={handleCellClassname(cellName)}>{handleRenderCell(cellName, currentData[0]?.[cellName])}</Cell>
      ))}
  </Row>
);

function LeaderBoard() {
  return (
    <div className={cx(styles['table-wrapper'])}>
      <Table
        columns={columns}
        rows={rows}
        className={{ cell: handleCellClassname, headerCell: handleCellClassname }}
        summary={handleRenderSummary}
        renderCell={handleRenderCell}
      />
    </div>
  );
}

export { LeaderBoard };
