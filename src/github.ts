import * as core from '@actions/core';
import { Octokit } from '@octokit/action';
import { components } from '@octokit/openapi-types';
import path from 'node:path';

type GetRepoContentResponseDataFile = components['schemas']['content-file'];

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

if (!process.env.GITHUB_REPOSITORY) {
  throw new Error('Failed to get GitHub repository');
}

const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

async function getContent(path: string) {
  try {
    const currentFile = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    const data =
      currentFile && (currentFile.data as GetRepoContentResponseDataFile);

    return data;
  } catch (error) {
    return null;
  }
}

export async function commit(data: string, filePath: string) {
  try {
    const prevFile = await getContent(filePath);

    const newBase64Content = Buffer.from(data, 'utf8').toString('base64');

    if (prevFile && prevFile.content === newBase64Content) {
      core.info(`No changes on ${path}`);
      return;
    }

    const fileName = path.basename(filePath);
    const message = `Update ${fileName}`;

    const { status } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message,
      content: newBase64Content,
      sha: prevFile && prevFile.sha,
    });

    core.info(`Successfully commit list, status: ${status}`);
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : 'Unknown octokit error';
    core.warning(msg);
  }
}
