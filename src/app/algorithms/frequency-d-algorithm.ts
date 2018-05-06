export class FrequencyDAlgorithm implements App.ICodingAlgorithm {

  public getVertexCodeMap(tableData: App.TableRow[], numOfStates: number): App.TVertexData {
    const capacity: number = this.getCapacity(numOfStates);

    const sortedByFrequencyVertexes: { id: number, frequency: number }[] = this._getSortedByFrequencyVertexes(tableData);
    const vertexCodesMap: App.TVertexData = new Map();

    const codeMap: Map<number, number[]> = this._getCodeMap(capacity);

    for (let i = 0, numOfDigits = 0; i < numOfStates; i++) {
      if (codeMap.get(numOfDigits).length === 0) {
        numOfDigits++;
      }

      if (sortedByFrequencyVertexes[i]) {
        vertexCodesMap.set(sortedByFrequencyVertexes[i].id, codeMap.get(numOfDigits).shift());
      }
    }

    const sortedByIndexVertexes: [number, number][] = Array
      .from(vertexCodesMap)
      .sort((a: number[], b: number[]) => {
        if (a[0] > b[0]) {
          return 1;
        }

        if (a[0] < b[0]) {
          return -1;
        }

        return 0;
      });

    return new Map(sortedByIndexVertexes);
  }

  private _getSortedByFrequencyVertexes(tableData: App.TableRow[]): { id: number, frequency: number}[] {
    const vertexFrequencyMap: Map<number, { id: number, frequency: number }> = new Map();

    tableData.forEach((tableRow: App.TableRow) => {
      if (!vertexFrequencyMap.has(tableRow.distState)) {
        vertexFrequencyMap.set(tableRow.distState, { id: tableRow.distState, frequency: 0 });
      }

      vertexFrequencyMap.get(tableRow.distState).frequency++;
    });

    return Array.from(vertexFrequencyMap.values())
      .sort((a, b) => {
        if (a.frequency < b.frequency) {
          return 1;
        }

        if (a.frequency > b.frequency) {
          return -1;
        }

        return a.id > b.id
          ? 1
          : -1;
      });
  }

  private _getCodeMap(capacity: number): Map<number, number[]> {
    const codeMap: Map<number, number[]> = new Map();
    const maxCapacityValue: number = (2 ** capacity) - 1;

    for (let i: number = 0; i <= maxCapacityValue; i++) {
      const numOfDigits: number = this._getNumOfDigits(i);

      if (!codeMap.has(numOfDigits)) {
        codeMap.set(numOfDigits, []);
      }

      codeMap.get(numOfDigits).push(i);
    }

    return codeMap;
  }

  private _getNumOfDigits(num: number): number {
    return num
      .toString(2)
      .split('1')
      .length - 1;
  }

  public getCapacity(numOfStates: number): number {
    return Math.ceil(Math.log2(numOfStates));
  }
}
