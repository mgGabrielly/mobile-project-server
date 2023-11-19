const extractClass = function (matriculation: string) {
    const partes = matriculation.split('e');
    const turma = partes[0];
    return turma;
}

export default extractClass;