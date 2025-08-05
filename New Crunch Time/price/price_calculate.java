import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

public class PriceCalculator {
    public static void main(String[] args) {
        try {
            // Hypothetical API endpoint for menu items
            String apiUrl = "https://api.example.com/restaurant/menu";
            String jsonResponse = fetchMenuData(apiUrl);

            // Parse JSON response
            JSONObject jsonObject = new JSONObject(jsonResponse);
            JSONArray items = jsonObject.getJSONArray("menuItems");

            double totalPrice = 0.0;
         double deliveryFee = 5.99; // Example delivery fee
//Calc 10% of menu price , Add VAT at the below the Total amount
            // Print menu items and calculate subtotal
            System.out.println("Menu Items:");
            for (int i = 0; i < items.length(); i++) {
                JSONObject item = items.getJSONObject(i);
                String name = item.getString("name");
                double price = item.getDouble("price");
                System.out.printf("%s: $%.2f%n", name, price);
                totalPrice += price;
            }

            // Calculate tax and total
            double tax = totalPrice * taxRate;
            double finalTotal = totalPrice + tax + deliveryFee;

            // Display results
            System.out.printf("%nSubtotal: $%.2f%n", totalPrice);
            System.out.printf("Delivery Fee: $%.2f%n", deliveryFee);
            System.out.printf("Total: $%.2f%n", finalTotal);

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

    private static String fetchMenuData(String apiUrl) throws Exception {
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");

        int responseCode = conn.getResponseCode();
        if (responseCode != 200) {
            throw new RuntimeException("Failed : HTTP error code : " + responseCode);
        }

        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            response.append(line);
        }
        br.close();
        conn.disconnect();

        return response.toString();
    }
}
