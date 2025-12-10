import * as fs from 'fs';
import * as path from 'path';

export interface OracleTestCase {
  id: string;
  description: string;
  category: string;
  input: any;
  mockData: any;
  expectedOutput: any;
  expectedBehavior: any;
}

export interface Oracle {
  metadata: {
    version: string;
    description: string;
    createdAt: string;
    author: string;
  };
  testCases: OracleTestCase[];
}

/**
 * Carica un oracolo JSON
 * @param oracleName Nome dell'oracolo (senza estensione)
 * @returns Oracle object
 */
export function loadOracle(oracleName: string): Oracle {
  const oraclePath = path.join(
    __dirname,
    '../oracles',
    `${oracleName}-oracle.json`,
  );
  const content = fs.readFileSync(oraclePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Filtra test cases per categoria
 * @param oracle Oracle object
 * @param category Categoria da filtrare
 * @returns Array di test cases filtrati
 */
export function filterByCategory(
  oracle: Oracle,
  category: string,
): OracleTestCase[] {
  return oracle.testCases.filter((tc) => tc.category === category);
}

/**
 * Ottiene un test case specifico per ID
 * @param oracle Oracle object
 * @param id ID del test case
 * @returns Test case o undefined
 */
export function getTestCase(
  oracle: Oracle,
  id: string,
): OracleTestCase | undefined {
  return oracle.testCases.find((tc) => tc.id === id);
}

/**
 * Ottiene tutti i test cases di successo
 * @param oracle Oracle object
 * @returns Array di test cases di successo
 */
export function getSuccessCases(oracle: Oracle): OracleTestCase[] {
  return filterByCategory(oracle, 'success');
}

/**
 * Ottiene tutti i test cases di errore
 * @param oracle Oracle object
 * @returns Array di test cases di errore
 */
export function getErrorCases(oracle: Oracle): OracleTestCase[] {
  return filterByCategory(oracle, 'error');
}

/**
 * Ottiene tutti i test cases edge-case
 * @param oracle Oracle object
 * @returns Array di test cases edge-case
 */
export function getEdgeCases(oracle: Oracle): OracleTestCase[] {
  return filterByCategory(oracle, 'edge-case');
}
