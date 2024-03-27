import math

def twitter_towers():
    while True:

        user_choice = int(input("For a rectangular tower press 1, for a triangular tower press 2. To exit press 3: "))

        if user_choice == 3:
            print("Exiting the program.")
            break

        width = int(input("Please insert a width: "))
        height = int(input("Please enter a height greater than or equal to 2: "))

        if user_choice == 1:
            if width == height or (height - width) > 5:
                print("Rectangular tower area: ", width * height)
            else:
                print("Rectangular tower perimeter: ", (width + height) * 2)

        elif user_choice == 2:
            user_choice2 = int(input("For the triangular perimeter press 1, for printing the triangular press 2: "))
            if user_choice2 == 1:
                triangle_side = math.sqrt((width // 2) ** 2 + height ** 2)
                print("Triangular tower perimeter: ", width + triangle_side * 2)

            elif user_choice2 == 2:
                if width % 2 == 0 or width > height * 2:
                    print("The triangle cannot be printed.")
                else:
                    print_triangle(width, height)
        else:
            print("Invalid choice. Please select again.")

def print_triangle(width, height):
    odd_numbers = []

    for num in range(2, width):
        if num % 2 != 0:
            odd_numbers.append((num, 0))

    if odd_numbers:
        middle_rows_number = (height-2) // len(odd_numbers)
        for i in range(len(odd_numbers)):
            odd_numbers[i] = (odd_numbers[i][0], middle_rows_number)

        if (height-2) % len(odd_numbers) != 0:
            odd_numbers[0] = (odd_numbers[0][1], middle_rows_number + 1)
    else:
        odd_numbers.append((1, height-2))

    print(" " * (width // 2 - 1), "*")

    for odd_number in odd_numbers:
        for i in range(odd_number[1]):
            print(" " * ((width-odd_number[0])//2 - 1), "*" * odd_number[0])

    print("*" * width)

if __name__ == '__main__':
    twitter_towers()
