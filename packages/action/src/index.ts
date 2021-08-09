import * as core from '@actions/core';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';

import { createInstance } from '@cpany/core';
import { codeforcesPlugin } from '@cpany/codeforces';

import { createGitFileSystem } from './fs';
import type { ICPanyConfig } from './type';

async function getConfig(path: string) {
  const content = readFileSync(path, 'utf8');
  return load(content) as ICPanyConfig;
}

async function run() {
  const configPath = core.getInput('config');
  const config = await getConfig(configPath);
  core.info(JSON.stringify(config, null, 2));

  const instance = createInstance({ plugins: [...codeforcesPlugin()] });

  const fs = await createGitFileSystem('./');

  const configStatic = config?.static ?? [];
  for (const id of configStatic) {
    const result = await instance.load(id);
    if (result !== null) {
      core.info(`Fetch ${id}`);
      const { key, content } = result;
      await fs.add(key, content);
    }
  }

  const configUser = config?.users ?? {};
  for (const userKey in configUser) {
    const user = configUser[userKey];
    for (const type in user) {
      const handles = user[type];
      for (const handle of handles) {
        const result = await instance.transform({
          id: handle,
          type
        });
        if (result !== null) {
          core.info(`Fetched ${result.key}`);
          const { key, content } = result;
          await fs.add(key, content);
        }
      }
    }
  }

  await fs.push();
}

run();
