/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 18:01:59
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-18 21:58:34
 * @Description: joi校验mysql信息
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import Joi from 'joi';
import { MysqlEnum } from 'src/common/enums/mysql.enum';
import { ipv4Regex } from '../utils/regexp.util';

// 校验mysql数据库连接相关信息是否正确
const mysqlConfigSchema = Joi.object({
  // 数据库类型
  [MysqlEnum.MYSQL_TYPE]: Joi.string().valid('mysql', 'mariadb').required(),
  // 通过正则表达式匹配ip地址
  [MysqlEnum.MYSQL_HOST]: Joi.string().pattern(ipv4Regex).required(),
  // 必须是numer类型
  [MysqlEnum.MYSQL_PORT]: Joi.number().required(),
  [MysqlEnum.MYSQL_USER]: Joi.string().required(),
  [MysqlEnum.MYSQL_PASSWORD]: Joi.string().required(),
  [MysqlEnum.MYSQL_DB]: Joi.string().required(),
}).messages({
  // 如何单个配消息提示需要确认写法
  'any.required': '{{#label}}不能为空', // 所有的必填类型走这里
  'string.pattern.base': '{{#label}}格式不正确，不符合规则：{{#regex}}', // 所有正则都会走这个
  'string.base': '{{#label}}必须是字符串类型', // 所有的string类型走这里
  'number.base': '{{#label}}需要number类型', // 所有的number类型走这里
  'any.only': '{{#label}}只能mysql或者mariadb',
});

export default mysqlConfigSchema;
