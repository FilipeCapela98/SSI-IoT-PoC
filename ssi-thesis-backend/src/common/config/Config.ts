import { ISettings } from 'src/interfaces/ISettings';

import {DefaultConfig} from './DefaultConfig';

export class Config {
  private NAMESPACE: string = 'app:config';

  public get settings(): ISettings {
    const defaultSettings: ISettings = DefaultConfig.settings;
    return defaultSettings;
  }
}
