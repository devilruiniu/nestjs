import dayjs from 'dayjs';

/**
 * 格式化时间为 YYYY-MM-DD HH:mm:ss
 * @param date 时间
 */
export function formatDate(date?: Date | string | number) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 格式化时间为 YYYY-MM-DD HH:mm:ss:SSS（带毫秒）
 * @param date 时间
 */
export function formatDateWithMs(date?: Date | string | number) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss:SSS');
}
