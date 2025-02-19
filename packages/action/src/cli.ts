import * as core from '@actions/core';

import { run } from './action';

const plugins = core
  .getInput('plugins')
  ?.split(',')
  .map((plugin) => plugin.trim().toLowerCase())
  .filter((plugin) => plugin !== undefined && plugin !== null && plugin !== '');

run({
  disableGit: false,
  maxRetry: +core.getInput('max-retry'),
  plugins
});
