import * as reader from 'xlsx';

const readDataStudents = function (sheet: string): any[] {
    const finalArr: any[] = [];

    const file = reader.readFile(sheet);

    const sheets = file.SheetNames;

    const data = reader.utils.sheet_to_json(file.Sheets[sheets[0]]);

    for (let i = 1; i < data.length; i++) {
        const element: any = data[i];
        const dataStudents = {
            id: element.__EMPTY,
            name: element.__EMPTY_1,
            client: element.__EMPTY_2,
            market: element.__EMPTY_3,
            box_type: element.__EMPTY_4,
            mold_family: element.__EMPTY_5,
            lid_type: element.__EMPTY_6,
            box_id: element.__EMPTY_7,
            box_quantity: element.__EMPTY_8,
            lid_id: element.__EMPTY_9,
        };
        finalArr.push(dataStudents);
    }
    return finalArr;
};

export default readDataStudents;
