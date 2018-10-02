package com.mapanything;

import android.os.Bundle;

import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MapAnything";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);

    }

    //    @Override
//    protected boolean getUseDeveloperSupport() {
//        return BuildConfig.DEBUG;
//    }
//    @Override
//    protected List<ReactPackage> getPackages() {
//        return Arrays.<ReactPackage>asList(
//                new MainReactPackage(),
//                new MapsPackage(this) //here you must be write the param this
//        );
//    }
}

