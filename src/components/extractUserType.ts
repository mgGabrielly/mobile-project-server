const extractUserType = function (email: string) {
    const partes = email.split('@');
    const parteVerif = partes[1];
    if(parteVerif == 'discente.ifpe.edu.br'){
        return "student";
    } else {
      return "admin"
    }
}

export default extractUserType;