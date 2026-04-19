/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 17:48:56
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-18 22:01:23
 * @Description: typeorm配置，将这个配置注册到配置系统中，应用的其他部分就可以通过configService来获取配置信息
 * 优点：分离不同场景的配置信息，提高代码的可维护性和可扩展性，便于管理
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { ConfigService, registerAs } from '@nestjs/config';
import { MysqlEnum } from 'src/common/enums/mysql.enum';

export default registerAs('typeorm', () => {
  const config = new ConfigService();
  // 因为在app.moudle.ts中使用了Joi做必填校验，所以这里可以直接使用断言为对应的类型
  return {
    type: config.get(MysqlEnum.MYSQL_TYPE) as string,
    host: config.get(MysqlEnum.MYSQL_HOST) as string,
    port: config.get(MysqlEnum.MYSQL_PORT) as number,
    username: config.get(MysqlEnum.MYSQL_USER) as string,
    password: config.get(MysqlEnum.MYSQL_PASSWORD) as string,
    database: config.get(MysqlEnum.MYSQL_DB) as string,
  };
});
