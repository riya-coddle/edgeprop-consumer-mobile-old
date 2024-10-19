package my.com.theedgeproperty.app;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import android.content.Intent;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Edgeprop";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        my.com.theedgeproperty.app.MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
}
