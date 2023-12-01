export function stringToDate(dateTimeString : string) : Date {
  const acceptedFormat = new RegExp(/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4} [0-9]{1,2}:[0-9]{1,2}$/);

  if(!dateTimeString.match(acceptedFormat)) {
    throw new Error("Fomato de data não aceito! O fomato aceito é dd/MM/YYYY HH:mm");
  }

  const [dateString, time] = dateTimeString.split(" ");

  const [day, month, year] = dateString!.split("/");

  const [hour, minutes] = time!.split(":");

  const date = new Date(`${year}-${month}-${day}T${hour}:${minutes}z`);

  if(date.toString() === "Invalid Date") {
    throw new Error("A data inserida está inválida");
  }

  return date;
}