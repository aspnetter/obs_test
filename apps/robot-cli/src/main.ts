import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';

const API_ENDPOINT_URL = 'http://localhost:3000';
const FS_FILE_ENCODING = 'utf8';

(async () => {
  const userArgs = process.argv.slice(2);

  const inputFilePath = userArgs[0];
  const outputFilePath = userArgs[1];

  try {
    validateArgs(inputFilePath, outputFilePath);

    const inputJson = await fs.promises.readFile(
      inputFilePath,
      FS_FILE_ENCODING
    );

    const outputJson = await callApi(inputJson);

    await fs.promises.writeFile(outputFilePath, outputJson, FS_FILE_ENCODING);
  } catch (error) {
    console.log(error.message);
    //turns out, sadly doesn't work with nx:serve, it's a known issue https://github.com/nrwl/nx/issues/9239
    process.exit(1);
  }
})();

/**
 * Validates the format of the input parameters to be valid paths to JSON files
 *
 * @param inputFilePath - full or relative path to the input file
 * @param outputFilePath - full or relative path to the output file
 */
function validateArgs(inputFilePath: string, outputFilePath: string): void {
  if (!isValidJsonPath(inputFilePath)) {
    throw Error(`Input file path '${inputFilePath}' is invalid`);
  }

  if (!isValidJsonPath(outputFilePath)) {
    throw Error(`Output file path '${outputFilePath}' is invalid`);
  }
}

/**
 * Checks if the path format matches the regular expression
 * @param path file path
 * @returns if the path is valid
 */
function isValidJsonPath(path: string): boolean {
  const jsonFilePathRegex = /([A-z0-9-_+]+\/)*([A-z0-9]+\.(json))$/gm;
  return path.match(jsonFilePathRegex) != null;
}

/**
 * Calls the Robot API
 * @param inputJson Robot simulator instructions
 * @returns Robot simulator exacution result
 */
async function callApi(inputJson: string): Promise<string> {
  const requestConfig: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const testRunResponse = await axios.post(
    API_ENDPOINT_URL,
    inputJson,
    requestConfig
  );

  const outputJson = JSON.stringify(testRunResponse.data);

  return outputJson;
}
