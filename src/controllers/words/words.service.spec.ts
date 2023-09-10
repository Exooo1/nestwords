import { Test, TestingModule } from "@nestjs/testing";
import { WordsController } from "./words.controller";
import { WordsService } from "./words.service";
import { getModelToken } from "@nestjs/mongoose";
import { Account } from "../../schemas/auth/account.schema";
import { Model } from "mongoose";

describe("WordsService", () => {
  const mockWordsService = {
    findOne: jest.fn()
  };
  const word = {
    word: "Arrive",
    translate: "Прибывать, приезжать",
    description: "",
    added: "Mon Aug 14 2023 13:16:51",
    _id: "64d9ff13b2631a5fb52b4814"
  };
  let wordsService: WordsService;
  let model: Model<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordsController],
      providers: [WordsService, {
        provide: getModelToken(Account.name),
        useValue: mockWordsService
      }]
    }).compile();

    wordsService = module.get<WordsService>(WordsService);
    model = module.get<Model<Account>>(getModelToken(Account.name));
  });

  describe("Words", () => {
    it("should return true", () => {
      expect(wordsService).toBeDefined();
    });
  });

  it("getWords", async () => {
    jest.spyOn(model, "findOne").mockResolvedValue(word);
    console.log(jest.spyOn(model, "findOne").mockResolvedValue(word))
    // const test ="634e95f099446974f65fff5b"
    // const result = await wordsService.findWord("Arrive", test);
    // console.log(result);
  });
});
