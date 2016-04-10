#### Install mitmproxy
```
sudo easy_install pip
pip install mitmproxy
```

Next update pyOpenSSL to 0.14:

Download pyOpenSSL-0.14 package from here:
https://pypi.python.org/pypi/pyOpenSSL

Decompress the content of the file to the directory where the current version of pyOpenSSL is located:
(see the following example directory):
```
/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python
```

The location will be nofified by running the ```mitmdump``` command:
```
$ mitmdump -q --anticache -s "../scripts/proxy.py ../src/js/sample_analyses/ChainedAnalyses.js ../src/js/runtime/analysisCallbackTemplate.js"
> You are using an outdated version of pyOpenSSL: mitmproxy requires pyOpenSSL 0.14 or greater.
> Your pyOpenSSL 0.13 installation is located at /System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/OpenSSL
```

in the pyOpenSSL-0.14 directory, run the following command to install the new version of pyOpenSSL:
```
sudo python setup.py install --user
```

#### Install mitmproxy certificate
Details can be found at this location:
http://mitmproxy.org/doc/ssl.html

More details:

In the jalangi2 directory, input the following commands to generate ```cert.pen``` file:
```
$ openssl genrsa -out cert.key 8192
$ openssl req -new -x509 -key cert.key -out cert.crt
    (Specify the mitm domain as Common Name, e.g. *.google.com)
$ cat cert.key cert.crt > cert.pem
$ mitmproxy --cert=cert.pem
```
For the last command, after running it, the console will be occupied.
Open the browser your want to add certificate, surf a few web pages
and back to the console and enter 'q' and 'yes'.

Now you are good to go:
```
../scripts/mitmproxywrapper.py -t -q --anticache -s "../scripts/proxy.py ../src/js/sample_analyses/ChainedAnalyses.js ../src/js/runtime/analysisCallbackTemplate.js"
```
