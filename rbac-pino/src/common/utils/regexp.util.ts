/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 18:07:56
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-18 18:12:19
 * @Description: 正则相关匹配内容&方法
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
// 定义ipv4的正则表达式
export const ipv4Regex: RegExp =
  /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
// 是否为ip地址
export function isIPV4Address(ipAddress: string): boolean {
  return ipv4Regex.test(ipAddress);
}
