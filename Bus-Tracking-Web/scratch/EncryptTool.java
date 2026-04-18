import org.jasypt.util.text.BasicTextEncryptor;

public class EncryptTool {
    public static void main(String[] args) {
        BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
        textEncryptor.setPassword("CampusBusSecret2026"); // Master Password
        
        String myApiKey = "AIzaSyC3DhUwnteL3qM-kAPnK7o1_v6UUrPyb2I";
        String encryptedApiKey = textEncryptor.encrypt(myApiKey);
        
        System.out.println("Original: " + myApiKey);
        System.out.println("Encrypted: " + encryptedApiKey);
    }
}
