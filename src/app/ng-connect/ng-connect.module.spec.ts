import { NgConnectModule } from './ng-connect.module';

describe('NgConnectModule', () => {
  let ngConnectModule: NgConnectModule;

  beforeEach(() => {
    ngConnectModule = new NgConnectModule();
  });

  it('should create an instance', () => {
    expect(ngConnectModule).toBeTruthy();
  });
});
