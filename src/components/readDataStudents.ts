import * as reader from 'xlsx';

const readDataStudents = function (sheet: string): any[] {
    const finalArr: any[] = [];

    const file = reader.readFile(sheet);

    const sheets = file.SheetNames;

    const data = reader.utils.sheet_to_json(file.Sheets[sheets[0]]);

    for (let i = 0; i < data.length; i++) {
        const element: any = data[i];
        const dataStudents = {
            name: element.nome,
            email: element.email,
            telephone: String(element.telefone),
            matriculation: element.matricula,
        };
        finalArr.push(dataStudents);
    } 
    // console.log(finalArr);
    return finalArr;
    
};

export default readDataStudents;
