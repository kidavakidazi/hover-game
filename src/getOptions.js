export default class GetOptions {

  async getOptions() {
    const response = await fetch('https://demo1030918.mockable.io/')
    return await response.json()
  };

  async getEasyMode() {
    return await this.getOptions()
      .then(res => res.easyMode.field);
  };

  async getNormalMode() {
    return await this.getOptions()
      .then(res => res.normalMode.field);
  };

  async getHardMode() {
    return await this.getOptions()
      .then(res => res.hardMode.field);
  };
};



