function getCurrentDate(): { day: number, month: string, year: number } {
    const months: string[] = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril',
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const currentDate: Date = new Date();
    
    const day: number = currentDate.getDate();
    const month: string = months[currentDate.getMonth()];
    const year: number = currentDate.getFullYear();

    return { day, month, year };
}

export default getCurrentDate;
