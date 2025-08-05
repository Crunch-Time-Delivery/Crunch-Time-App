import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class GeolocationClient {
    private static final String BASE_URL = "http://ip-api.com/json/";

    public String getGeolocationByDomain(String domain) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + domain + "?fields=61439"))
                .GET()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public String getGeolocationByCallerIP() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "?fields=61439"))
                .GET()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public static void main(String[] args) throws Exception {
        GeolocationClient client = new GeolocationClient();
        System.out.println(client.getGeolocationByDomain("google.com"));
        System.out.println(client.getGeolocationByCallerIP());
    }
}
