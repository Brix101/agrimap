import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import FarmerModel from "../models/farmer.model";
import UserModel from "../models/user.model";
import logger from "./logger";

export const generateFakeUsers = () => {
  const users = [
    {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      password: "Password",
      role: "ADMIN",
    },
  ];

  const roles = ["USER", "ADMIN"];

  for (let i = 0; i < 10; i++) {
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const user = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      role: randomRole,
    };
    users.push(user);
  }
  return users;
};

export const generateFakeFarmers = () => {
  const farmers = [];
  const predefinedAddresses = [
    {
      streetAddress: "123 Main St",
      cityOrProvince: "Davao City",
      municipality: "Davao del Sur",
      barangay: "Buhangin",
      zipcode: "8000",
    },
    {
      streetAddress: "456 Elm St",
      cityOrProvince: "Cagayan de Oro City",
      municipality: "Misamis Oriental",
      barangay: "Carmen",
      zipcode: "9000",
    },
    {
      streetAddress: "789 Oak St",
      cityOrProvince: "Zamboanga City",
      municipality: "Zamboanga del Sur",
      barangay: "Tetuan",
      zipcode: "7000",
    },
    {
      streetAddress: "101 Pine St",
      cityOrProvince: "General Santos City",
      municipality: "South Cotabato",
      barangay: "Calumpang",
      zipcode: "9500",
    },
    {
      streetAddress: "202 Cedar St",
      cityOrProvince: "Butuan City",
      municipality: "Agusan del Norte",
      barangay: "Baan",
      zipcode: "8600",
    },
  ];

  for (let i = 0; i < predefinedAddresses.length; i++) {
    const predefinedAddress =
      predefinedAddresses[i % predefinedAddresses.length];
    const formattedDate = dayjs().format("DD-MM-YY");
    const countString = (i + 1).toString().padStart(6, "0");

    const formattedString = `${formattedDate}-000-${countString}`;
    const farmer = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      middleInitial: faker.person.middleName().charAt(0),
      address: predefinedAddress,
      phoneNumber: faker.phone.number().slice(0, 11),
      rspc: formattedString,
    };
    farmers.push(farmer);
  }
  return farmers;
};

export const seed = async () => {
  const userCount = await UserModel.countDocuments();
  const farmerCount = await FarmerModel.countDocuments();

  if (userCount <= 0) {
    await UserModel.insertMany(generateFakeUsers());
    logger.info("User seeded");
  }

  if (farmerCount <= 0) {
    await FarmerModel.insertMany(generateFakeFarmers());
    logger.info("Farmer seeded");
  }
};
