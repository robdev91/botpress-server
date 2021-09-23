
const watcher = require('./watcher')
const growthWatcher = require('growth-watch');

describe('services/watcher', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('create', (done) => {
    let cbCount = 0
    const watcher1 = watcher('.', 1, (id) => {
      ++ cbCount;
      if (cbCount == 2) {
        watcher1.dispose();
        done();
      }
    })
    expect(watcher1.id).toBe(1);
  })

  test('expand', (done) => {
    const watcher1 = watcher('.', 1, (id) => { })
    jest.spyOn(watcher1.watcher, 'toggleExpansion').mockImplementation((path) => {
      expect(path).toBe('expand');
      done();
    })
    watcher1.expand('expand');
    expect(watcher1.watcher.toggleExpansion).toHaveBeenCalledTimes(1);
    watcher1.dispose();
  })

  test('collapse', (done) => {
    const watcher1 = watcher('.', 1, (id) => { })
    jest.spyOn(watcher1.watcher, 'toggleExpansion').mockImplementation((path) => {
      expect(path).toBe('collapse');
      done();
    })
    watcher1.collapse('collapse');
    expect(watcher1.watcher.toggleExpansion).toHaveBeenCalledTimes(1);
    watcher1.dispose();
  })
})