import { Injectable } from '@nestjs/common';
import { SamplersService } from './models/sampler/sampler.service';
import { DiffersService } from './models/differ/differ.service';

@Injectable()
export class PuppeteerService {
  // TODO: @MarcoDena @Stefanoberka import a service to use a functions for Models with
  constructor(
    private samplersService: SamplersService,
    private differsService: DiffersService,
  ) {}

  // TODO: @MarcoDena Create a functions to create a new browser instance and snapshooting a page
}
