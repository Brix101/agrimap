import dayjs from "dayjs";
import mongoose from "mongoose";

export interface FarmerInput {
  rspc?: string;
  firstname: string;
  lastname: string;
  middleInitial: string;
  address: {
    streetAddress: string;
    cityOrProvince: string;
    municipality: string;
    barangay: string;
    zipcode: string;
  };
  phoneNumber: string;
}

export interface IFarmer extends FarmerInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const farmerSchema = new mongoose.Schema(
  {
    rspc: {
      type: String,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    middleInitial: {
      type: String,
    },
    address: {
      streetAddress: {
        type: String,
      },
      cityOrProvince: {
        type: String,
      },
      municipality: {
        type: String,
      },
      barangay: {
        type: String,
      },
      zipcode: {
        type: String,
      },
    },
    phoneNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  }
);

const KalObj = {
  Bangbang: "001",
  Baborawon: "002",
  Canituan: "003",
  Kibaning: "004",
  Kinura: "005",
  Lampanusan: "006",
  "Maca-opao": "007",
  Malinao: "008",
  Pamotolon: "009",
  Poblacion: "010",
  Public: "011",
  "Ninoy Aquino": "012",
  "San Vicente Ferrer": "013",
  "West Poblacion": "014",
};

farmerSchema.pre("save", async function (next) {
  if (this.isNew) {
    let farmer = this as IFarmer;

    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");

    // @ts-ignore
    let count: number = await this.constructor.countDocuments({
      createdAt: {
        $gte: today.toDate(),
        $lt: tomorrow.toDate(),
      },
    });

    count++;

    const formattedDate = today.format("DD-MM-YY");
    const countString = count.toString().padStart(6, "0");
    const code =
      KalObj[farmer.address.barangay as keyof typeof KalObj] ?? "000";

    const formattedString = `${formattedDate}-${code}-${countString}`;

    farmer.rspc = formattedString;
  }

  return next();
});

const FarmerModel = mongoose.model<IFarmer>("Farmer", farmerSchema);

export default FarmerModel;
