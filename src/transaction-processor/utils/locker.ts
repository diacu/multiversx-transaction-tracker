import { Logger } from '@nestjs/common';

export class Locker {
  private static lockArray: string[] = [];

  static async lock(
    key: string,
    func: () => Promise<void>,
    log: boolean = false,
  ) {
    const logger = new Logger('Lock');

    if (Locker.lockArray.includes(key) && log) {
      logger.log(`${key} is already running`);
      return;
    }

    Locker.lockArray.push(key);

    try {
      await func();
    } catch (error) {
      logger.error(`Error running ${key}`);
      logger.error(error);
    } finally {
      const index = Locker.lockArray.indexOf(key);
      if (index >= 0) {
        Locker.lockArray.splice(index, 1);
      }
    }
  }
}
