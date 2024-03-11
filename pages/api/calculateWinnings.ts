// pages/api/calculateWinnings.ts
import { NextApiRequest, NextApiResponse } from 'next';

// interface PlacedChip {
//     item: {
//         type: string;
//         value: number | number[];
//     };
//     sum: number;
// }

export enum ValueType {
    NUMBER,
    NUMBERS_1_12,
    NUMBERS_2_12,
    NUMBERS_3_12,
    NUMBERS_1_18,
    NUMBERS_19_36,
    EVEN,
    ODD,
    RED,
    BLACK,
    DOUBLE_SPLIT,
    QUAD_SPLIT,
    TRIPLE_SPLIT,
    EMPTY
  }
  
  
  export interface Item {
    type: ValueType;
    value: number;
    valueSplit: number[];
  }
  
  
  export interface PlacedChip {
    item: Item;
    sum: number;
  }

interface CalculateWinningsRequest extends NextApiRequest {
    body: {
        winningNumber: number;
        placedChips: PlacedChip[];
    };
}

export default async function handler(req: CalculateWinningsRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { winningNumber, placedChips } = req.body;

    if (typeof winningNumber !== 'number' || !Array.isArray(placedChips)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    const blackNumbers: number[] = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35];
    const redNumbers: number[] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

    function calculateWinnings(winningNumber: number, placedChips: PlacedChip[]): number {
        let win = 0;
        const arrayLength = placedChips.length;
        for (let i = 0; i < arrayLength; i++) {
            const placedChip = placedChips[i];
            const placedChipType = placedChip.item.type;
            const placedChipValue = placedChip.item.value;
            console.log(placedChipValue, 'placed chip value');
            console.log(placedChipType, 'placed chip type');

            if (Array.isArray(placedChipValue)) {
                if (placedChipType === ValueType.NUMBER && placedChipValue.includes(winningNumber)) {
                    win += placedChip.sum * 36;
                }
            } else {
                const placedChipSum = placedChip.sum;

                if (placedChipType === ValueType.NUMBER && placedChipValue === winningNumber) {
                    win += placedChipSum * 36;
                } else if (placedChipType === ValueType.BLACK && blackNumbers.includes(winningNumber)) {
                    win += placedChipSum * 2;
                } else if (placedChipType === ValueType.RED && redNumbers.includes(winningNumber)) {
                    win += placedChipSum * 2;
                } else if (placedChipType === ValueType.NUMBERS_1_18 && winningNumber >= 1 && winningNumber <= 18) {
                    win += placedChipSum * 2;
                } else if (placedChipType === ValueType.NUMBERS_19_36 && winningNumber >= 19 && winningNumber <= 36) {
                    win += placedChipSum * 2;
                } else if (placedChipType === ValueType.NUMBERS_1_12 && winningNumber >= 1 && winningNumber <= 12) {
                    win += placedChipSum * 3;
                } else if (placedChipType === ValueType.NUMBERS_2_12 && winningNumber >= 13 && winningNumber <= 24) {
                    win += placedChipSum * 3;
                } else if (placedChipType === ValueType.NUMBERS_3_12 && winningNumber >= 25 && winningNumber <= 36) {
                    win += placedChipSum * 3;
                } else if (placedChipType === ValueType.EVEN || placedChipType === ValueType.ODD) {
                    if (winningNumber % 2 == 0) {
                        win += placedChipSum * 2;
                    } else {
                        win += placedChipSum * 2;
                    }
                }
            }
        }

        return win;
    }

    const winnings = calculateWinnings(winningNumber, placedChips);
    console.log(winnings, 'winnings');
    res.status(200).json({ winnings });
}
