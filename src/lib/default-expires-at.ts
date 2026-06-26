import dayjs from "dayjs";

export function defaultExpiresAt(): string {
  return dayjs().add(3, "month").format("YYYY-MM-DD");
}

export function defaultExpiresAtDate(): Date {
  return dayjs().add(3, "month").toDate();
}
