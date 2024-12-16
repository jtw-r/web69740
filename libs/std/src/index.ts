import {groupAndSortByProps} from "./lib/sorting";

export * from './lib';

type TestData = {
  str: string;
  num: number;
  bool: boolean;
  obj?: TestData
}

/**
 * This function doesn't do anything, other than demo the ts-server hanging
 */
function test() {
  const data: TestData[] = [];

  /**
   * TS server hangs in files where `groupAndSortByProps` is imported
   */
  const sorted = groupAndSortByProps(data, [{
    key: "str",
    direction: "AZ",
  }])

  /**
   * Try modifying the lines below to something that would not compile,
   * autocomplete / hints are not working:
   */
  const a = sorted.reverse();
}
