// Car listing type
export interface CarListing {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  imageUrl: string;
  description?: string;
}

// Example in-memory data (replace with API/database in production)
const carListings: CarListing[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Vios",
    year: 2022,
    pricePerDay: 500000,
    imageUrl: "/images/vios.jpg",
    description: "Xe tiết kiệm nhiên liệu, phù hợp gia đình.",
  },
  {
    id: "2",
    make: "Kia",
    model: "Morning",
    year: 2021,
    pricePerDay: 400000,
    imageUrl: "/images/morning.jpg",
    description: "Nhỏ gọn, dễ di chuyển trong thành phố.",
  },
];

// Get all car listings
export function getCarListings(): CarListing[] {
  return carListings;
}

// Get a car listing by ID
export function getCarListingById(id: string): CarListing | undefined {
  return carListings.find((car) => car.id === id);
}

// Add a new car listing
export function addCarListing(car: CarListing): void {
  carListings.push(car);
}

// Remove a car listing by ID
export function removeCarListing(id: string): void {
  const index = carListings.findIndex((car) => car.id === id);
  if (index !== -1) {
    carListings.splice(index, 1);
  }
}