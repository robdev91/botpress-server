const { getBasename, isDirectory, getPathList } = require('./file')

const fs = require('fs');
const path = require('path')

describe('utils/file', () => {
  afterAll(() => {
    process.argv.pop()
    process.argv.pop()
    jest.restoreAllMocks();
  });

  test('getBasename', () => {
    expect(getBasename('utils/file.js')).toBe('file.js');
    expect(getBasename('utils/file')).toBe('file');
    expect(getBasename('file')).toBe('file');
  })

  test('isDirectory', () => {
    jest.spyOn(path, 'resolve').mockImplementation((path) => path);
    jest.spyOn(fs, 'lstatSync').mockImplementation((path) => {
      return {
        isDirectory: () => {
          if (path === 'file') {
            return false
          } else if (path === '~') {
            return true
          } else if (path === '.') {
            return true
          } else if (path === '..') {
            return true
          } else {
            return false
          }
        }
      }
    });

    expect(isDirectory('file')).toBe(false);
    expect(isDirectory('~')).toBe(true);
    expect(isDirectory('.')).toBe(true);
    expect(isDirectory('..')).toBe(true);
  });

  test('getPathList', () => {
    process.argv.push('.')
    process.argv.push('..')
    expect(getPathList()).toEqual([ '.', '..' ]);
  })
})