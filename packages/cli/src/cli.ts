#!/usr/bin/env node

import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { cac } from 'cac';
import { createServer, build } from 'vite';

import { createCPanyPlugin } from './plugin';

interface ICliOption {
  app?: string;
  data: string;
  out: string;
  port: number;
  homeContests: number;
  homeRecent: number;
}

const cli = cac('cpany')
  .option('--app <app path>', 'App path')
  .option('--data <data path>', 'Data path', { default: '.' })
  .option('--home-contests <contests number>', 'Contests number in Home', {
    default: 20
  })
  .option(
    '--home-recent <recent time seconds>',
    'Recent time seconds in Home',
    { default: 3600 * 24 * 30 }
  );

cli
  .command('dev', 'Start CPany dev server')
  .option('--port <port>', 'port to listen to', { default: 3000 })
  .action(async (option: ICliOption) => {
    const appPath = path.resolve(option.app ?? findDefaultAppPath());
    const dataPath = path.resolve(option.data);
    const pluginOption = {
      appRootPath: appPath,
      dataRootPath: dataPath,
      home: {
        contests: option.homeContests,
        recent: option.homeRecent
      }
    };

    const server = await createServer({
      root: appPath,
      server: {
        port: option.port
      },
      plugins: [await createCPanyPlugin(pluginOption)]
    });

    await server.listen();
  });

cli
  .command('build', 'Build CPany site')
  .option('--out <output path>', 'Output path', { default: 'site' })
  .action(async (option) => {
    const appPath = path.resolve(option.app ?? findDefaultAppPath());
    const dataPath = path.resolve(option.data);
    const pluginOption = {
      appRootPath: appPath,
      dataRootPath: dataPath,
      home: {
        contests: option.homeContests,
        recent: option.homeRecent
      }
    };

    await build({
      root: appPath,
      build: {
        outDir: path.resolve(option.out)
      },
      plugins: [await createCPanyPlugin(pluginOption)]
    });
  });

cli.help();

cli.version(
  JSON.parse(readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'))
    .version
);

cli.parse();

function findDefaultAppPath() {
  const segment = __dirname.split(path.sep);
  while (segment.length > 0) {
    const tryAppPath = path.join(...segment, 'node_modules', '@cpany', 'app');
    if (existsSync(tryAppPath)) {
      return tryAppPath;
    }
    segment.pop();
  }
  throw new Error('Can not find default app in node_modules');
}
