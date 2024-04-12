import * as core from '@actions/core';
import { Octokit } from '@octokit/action';
import { components } from '@octokit/openapi-types';
import path from 'node:path';

type GetRepoContentResponseDataFile = components['schemas']['content-file'];

export class Github {
  private owner: string;
  private repo: string;
  private octokit: Octokit;

  constructor() {
    if (!process.env.GITHUB_REPOSITORY) {
      throw new Error('Failed to get GitHub repository');
    }

    this.owner = process.env.GITHUB_REPOSITORY.split('/')[0];
    this.repo = process.env.GITHUB_REPOSITORY.split('/')[1];
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  private async getContent(path: string) {
    try {
      const currentFile = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
      });

      const data =
        currentFile && (currentFile.data as GetRepoContentResponseDataFile);

      return data;
    } catch (error) {
      return null;
    }
  }

  public async commit(data: string, filePath: string) {
    try {
      const prevFile = await this.getContent(filePath);

      const newBase64Content = Buffer.from(data, 'utf8').toString('base64');

      if (prevFile && prevFile.content === newBase64Content) {
        core.info(`No changes on ${path}`);
        return;
      }

      const fileName = path.basename(filePath);
      const message = `Update ${fileName}`;

      const { status } = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
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
}
