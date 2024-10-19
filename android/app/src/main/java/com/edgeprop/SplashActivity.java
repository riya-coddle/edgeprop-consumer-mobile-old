package my.com.theedgeproperty.app;

import android.content.Intent;
import android.os.Bundle;
//import android.support.v7.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatActivity;

import java.util.Timer;
import java.util.TimerTask;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.background_splash);
        if (getCallingActivity().getPackageName().equals("my.com.theedgeproperty.app")) {
            final Intent intent = new Intent(this, my.com.theedgeproperty.app.MainActivity.class);
            startActivity(intent);
        }
        finish();
    }
}