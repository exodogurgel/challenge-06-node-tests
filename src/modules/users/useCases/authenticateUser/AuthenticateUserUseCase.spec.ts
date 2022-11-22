import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { User } from "../../entities/User";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AppError } from "../../../../shared/errors/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let user: User;

describe("Authenticate User", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate a user", async () => {
    const user = {
      name: "User Test",
      email: "user@test.com",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const authentication = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authentication).toHaveProperty("token");
  });

  it("should not be able to authenticate a non-existant user", async () => {
    const userLoginData = {
      email: "user@test.com",
      password: "123123",
    };

    expect(async () => {
      await authenticateUserUseCase.execute(userLoginData);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    expect(async () => {
      const user = {
        name: "User Test",
        email: "user@test.com",
        password: "123",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrongpassword",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});