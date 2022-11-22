import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should to be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "John joe",
      email: "joe@example.com",
      password: "123"
    });

    expect(user).toHaveProperty("id");
  })

  it("should not to be able to register an users with email already registered", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user test",
        email: "test@example.com",
        password: "123",
      });

      await createUserUseCase.execute({
        name: "user test",
        email: "test@example.com",
        password: "123",
      });
    }).rejects.toBeInstanceOf(AppError)
  })

})