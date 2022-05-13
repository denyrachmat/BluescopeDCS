<template>
  <div>
    <template v-if="!userData.providerId">
      <b style="font-size: 24px">ID: {{ form.no_pol.no_pol }}</b>
      <q-select
        filled
        v-model="selectedId"
        use-input
        hide-selected
        fill-input
        input-debounce="100"
        :options="options"
        @filter="filterFn"
        hint="Minimum 3 characters to trigger filtering No Pol"
        style="padding-bottom: 32px"
        @update:model-value="onSelectNopol"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
        <template v-slot:selected>
          {{ model.label }}
        </template>
      </q-select>

      <q-separator />
    </template>
    <template v-else>
      <q-input label="No Pol" v-model="form.no_pol" />
    </template>

    <div class="q-py-md">
      <q-list bordered>
        <q-item clickable v-ripple @click="onClickPhoto(1)">
          <q-item-section avatar>
            <q-avatar>
              <img
                src="~assets/no_image.png"
                alt=""
                v-if="!form.photo.photo1"
              />
              <img :src="`data:image/png;base64,${form.photo.photo1}`" v-else />
            </q-avatar>
          </q-item-section>
          <q-item-section>Photo 1</q-item-section>
          <q-item-section side>
            <q-icon
              :name="!form.photo.photo1 ? 'block' : 'check'"
              :color="!form.photo.photo1 ? 'red' : 'primary'"
            />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="onClickPhoto(2)">
          <q-item-section avatar>
            <q-avatar>
              <img
                src="~assets/no_image.png"
                alt=""
                v-if="!form.photo.photo2"
              />
              <img :src="`data:image/png;base64,${form.photo.photo2}`" v-else />
            </q-avatar>
          </q-item-section>
          <q-item-section>Photo 2</q-item-section>
          <q-item-section side>
            <q-icon
              :name="!form.photo.photo2 ? 'block' : 'check'"
              :color="!form.photo.photo2 ? 'red' : 'primary'"
            />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="onClickPhoto(3)">
          <q-item-section avatar>
            <q-avatar>
              <img
                src="~assets/no_image.png"
                alt=""
                v-if="!form.photo.photo3"
              />
              <img :src="`data:image/png;base64,${form.photo.photo3}`" v-else />
            </q-avatar>
          </q-item-section>
          <q-item-section>Photo 3</q-item-section>
          <q-item-section side>
            <q-icon
              :name="!form.photo.photo3 ? 'block' : 'check'"
              :color="!form.photo.photo3 ? 'red' : 'primary'"
            />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="onClickPhoto(4)">
          <q-item-section avatar>
            <q-avatar>
              <img
                src="~assets/no_image.png"
                alt=""
                v-if="!form.photo.photo4"
              />
              <img :src="`data:image/png;base64,${form.photo.photo4}`" v-else />
            </q-avatar>
          </q-item-section>
          <q-item-section>Photo 4</q-item-section>
          <q-item-section side>
            <q-icon
              :name="!form.photo.photo4 ? 'block' : 'check'"
              :color="!form.photo.photo4 ? 'red' : 'primary'"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-separator />
    <q-btn-group spread>
      <q-btn color="orange" label="Clear" @click="onReset()" />
      <q-btn
        color="primary"
        label="Submit"
        @click="!userData.providerId ? onSubmit() : submitWithGoogle()"
        :disable="
          Object.values(form.photo).filter((val) => val !== '').length < 4 ||
          !form.no_pol
        "
      />
    </q-btn-group>

    <!-- Start Dialog Photo -->
    <q-dialog v-model="viewPhoto">
      <q-card class="q-dialog-plugin">
        <q-img
          src="~assets/no_image.png"
          v-if="!form.photo[`photo${choosedPhoto}`]"
        >
          <div class="absolute-bottom">
            <div class="text-h6">Photo {{ choosedPhoto }}</div>
          </div>
        </q-img>
        <q-img
          :src="`data:image/png;base64,${form.photo[`photo${choosedPhoto}`]}`"
          v-else
        >
          <div class="absolute-bottom">
            <div class="text-h6">Photo {{ choosedPhoto }}</div>
          </div>
        </q-img>
        <q-card-actions align="around">
          <q-btn
            color="red"
            label="Delete"
            :disable="!form.no_pol || !form.photo[`photo${choosedPhoto}`]"
            @click="clearPhoto(`photo${choosedPhoto}`)"
          />
          <q-btn
            color="primary"
            label="Capture"
            @click="captureImage(`photo${choosedPhoto}`)"
            :disable="
              !userData.providerId &&
              (!form.no_pol || form.photo[`photo${choosedPhoto}`] !== '')
            "
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { helpers } from "../../components/helpers";
import { Camera, CameraResultType } from "@capacitor/camera";
import {
  Filesystem,
  Directory,
  Encoding,
  FilesystemDirectory,
} from "@capacitor/filesystem";
import { Dialog, Notify, Loading, QSpinnerFacebook } from "quasar";

import app from "boot/firebase";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";

export default {
  mixins: [helpers],
  data() {
    return {
      stringOptions: [],
      selectedId: "",
      options: [],
      form: {
        no_pol: "",
        co_no: "",
        id: "",
        photo: {
          photo1: "",
          photo2: "",
          photo3: "",
          photo4: "",
        },
      },
      viewPhoto: false,
      choosedPhoto: 1,
      isGoogleSignIn: null,
      gDetail: null,
      folderGDriveID: "",
      folderIDDate: "",
    };
  },
  async created() {
    if (Object.keys(this.formsData).length > 0) {
      this.form = { ...this.formsData };
    }
    if (this.userData.providerId) {
      const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // console.log(user);
          this.gDetail = user;
          this.isGoogleSignIn = true;
        } else {
          this.gDetail = null;
          this.isGoogleSignIn = false;

          this.$store.commit("AuthStore/AuthStoreMutation", []);
          this.$router.push("/");
        }
      });

      const checkFolderID = await this.getFolderID("Bluescope DCS");
      if (
        checkFolderID.data &&
        checkFolderID.data.files &&
        checkFolderID.data.files.length > 0
      ) {
        this.folderGDriveID = checkFolderID.data.files[0].id;
        this.checkDatedFolder();
      } else {
        const createFolder = await this.createFolderGDrive("Bluescope DCS");
        if (createFolder) {
          this.folderGDriveID = createFolder.id;

          this.checkDatedFolder();
        }
      }
    }
  },
  methods: {
    async checkDatedFolder() {
      const today = new Date();
      const yearNow = today.getFullYear();
      const monthNow = ("0" + (today.getMonth() + 1)).slice(-2);
      const datenow = today.getDate();

      const folderName = `${yearNow}_${monthNow}_${datenow}`;

      const checkFolderID = await this.getFolderID(
        folderName,
        this.folderGDriveID
      );
      if (
        checkFolderID.data &&
        checkFolderID.data.files &&
        checkFolderID.data.files.length > 0
      ) {
        console.log("ada");
        this.folderIDDate = checkFolderID.data.files[0].id;
      } else {
        const createFolderDet = await this.createFolderGDrive(
          `${yearNow}_${monthNow}_${datenow}`,
          this.folderGDriveID
        );
        if (createFolderDet) {
          this.folderIDDate = createFolderDet.id;
        }

        console.log("gak ada");
      }
    },
    async onSelectNopol(val) {
      this.form.co_no = val.value;
      this.form.no_pol = val.no_pol;
      this.form.id = val.id;

      const getPhotoNopol = await this.postData(
        {
          loading: true,
          methods: "post",
          url: `DCS/checkPhotoBYCO`,
        },
        {
          co_no: val.value,
          no_pol: val.no_pol,
          id: val.id,
        }
      );

      if (getPhotoNopol && getPhotoNopol.status) {
        // http://localhost/bluescope_api/public/storage/DCS/2022_02_21/4444/539010/539010_1.jpg
        const today = new Date();
        const yearNow = today.getFullYear();
        const monthNow = ("0" + (today.getMonth() + 1)).slice(-2);
        const datenow = today.getDate();

        this.form.photo = {
          photo1: await this.getBase64Image(
            `${this.mainUrlStorage}/DCS/${yearNow}_${monthNow}_${datenow}/${val.no_pol}/${val.value}/${val.id}_1.jpg`
          ),
          photo2: await this.getBase64Image(
            `${this.mainUrlStorage}/DCS/${yearNow}_${monthNow}_${datenow}/${val.no_pol}/${val.value}/${val.id}_2.jpg`
          ),
          photo3: await this.getBase64Image(
            `${this.mainUrlStorage}/DCS/${yearNow}_${monthNow}_${datenow}/${val.no_pol}/${val.value}/${val.id}_3.jpg`
          ),
          photo4: await this.getBase64Image(
            `${this.mainUrlStorage}/DCS/${yearNow}_${monthNow}_${datenow}/${val.no_pol}/${val.value}/${val.id}_4.jpg`
          ),
        };
      } else {
        this.form.photo = {
          photo1: "",
          photo2: "",
          photo3: "",
          photo4: "",
        };
      }
    },
    async filterFn(val, update, abort) {
      if (val.length < 3) {
        abort();
        return;
      }

      const needle = val.toLowerCase();
      const dataNopol = await this.getData(needle);

      update(() => {
        if (dataNopol.length > 0) {
          this.options = dataNopol;
        }

        return;
      });
    },
    async getData(data = "") {
      const getNopol = await this.postData({
        loading: true,
        methods: "get",
        url: `DCS/getDataNopol/${btoa(data)}`,
      });

      if (getNopol && getNopol.status) {
        return getNopol.data;
      } else {
        return [];
      }
    },
    onClickPhoto(count) {
      this.viewPhoto = !this.viewPhoto;
      this.choosedPhoto = count;
    },
    async captureImage(dataForm) {
      this.viewPhoto = false;
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });

      // The result will vary on the value of the resultType option.
      // CameraResultType.Uri - Get the result from image.webPath
      // CameraResultType.Base64 - Get the result from image.base64String
      // CameraResultType.DataUrl - Get the result from image.dataUrl

      this.form = {
        ...this.form,
        photo: {
          ...this.form.photo,
          [dataForm]: image.base64String,
        },
      };
    },
    clearPhoto(dataForm) {
      Dialog.create({
        title: "Alert",
        message: "Are you sure want to delete this photo ?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          // console.log('OK')
          this.form.photo[dataForm] = "";
        })
        .onCancel(() => {
          // console.log('Cancel')
        });
    },
    async storeListPhotoLocally(arr) {
      await Filesystem.writeFile({
        path: "secrets/storedPt.txt",
        data: JSON.stringify(arr),
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    },
    onSubmit() {
      Dialog.create({
        title: "Alert",
        message: "Are you sure want to submit all this photo ?",
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          this.storeListPhotoLocally(this.form);

          const getNopol = await this.postData(
            {
              loading: true,
              methods: "post",
              url: `DCS/storePhoto`,
            },
            this.form
          );

          if (getNopol && getNopol.status) {
            Notify.create({
              color: "positive",
              message: getNopol.message,
            });
            this.initState();
          }
        })
        .onCancel(() => {
          // console.log('Cancel')
        });
    },
    onReset() {
      Dialog.create({
        title: "Alert",
        message: "Are you sure want to clear all this photo ?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          this.initState();
        })
        .onCancel(() => {
          // console.log('Cancel')
        });
    },
    initState() {
      this.form = {
        no_pol: "",
        co_no: "",
        photo: {
          photo1: "",
          photo2: "",
          photo3: "",
          photo4: "",
        },
      };

      this.options = [];

      this.selectedId = "";
    },
    async getBase64Image(url) {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result.replace(
            /^data:image\/(png|jpg|jpeg);base64,/,
            ""
          );
          resolve(base64data);
        };
      });
    },
    loginG() {
      const provider = new GoogleAuthProvider();

      const auth = getAuth(app);

      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("result", result);
          this.$q.notify({ message: "Sign In Success." });
        })
        .catch((error) => console.log("error", error));
    },
    convertBase64ToBlob(base64Image) {
      // Split into two parts
      const parts = base64Image.split(";base64,");

      // Hold the content type
      const imageType = parts[0].split(":")[1];

      // Decode Base64 string
      const decodedData = window.atob(parts[1]);

      // Create UNIT8ARRAY of size same as row data length
      const uInt8Array = new Uint8Array(decodedData.length);

      // Insert all character code into uInt8Array
      for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
      }

      // Return BLOB image after conversion
      return new Blob([uInt8Array], { type: imageType });
    },
    async submitWithGoogle() {
      const photoListKey = Object.keys(this.form.photo);

      Loading.show({
        spinner: QSpinnerFacebook,
        spinnerSize: 140,
        backgroundColor: "cyan",
        message: "Some important process is in progress. Hang on...",
        messageColor: "black",
      });
      const results = await Promise.all(
        photoListKey.map(async (item) => {
          // const data = await this.uploadToBucket(item, this.form.photo[item]);
          const data = await this.uploadFiles(this.form.photo[item], item);
          return [this.form.photo[item], item];
        })
      );

      if (results && results.length > 0) {
        Loading.hide();

        Notify.create({
          color: "positive",
          message: "Photo uploaded ! please check to your google drive...",
        });

        this.initState();
      } else {
        Loading.hide();
      }
    },
    processfile(imageURL) {
      const image = new Image();
      const onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        canvas.toBlob(function (blob) {
          return blob;
          // do stuff with blob
        });
      };

      image.onload = onload;
      image.src = imageURL;

      console.log(image);

      return image;
    },
    uploadToBucket(fileName, filenya) {
      const photo1 = this.convertBase64ToBlob(
        "data:image/(png|jpg|jpeg);base64," + filenya
      );
      const storage = getStorage();
      const storageRef = ref(storage, "photoList/" + fileName + ".jpg");

      const hasil = uploadBytes(storageRef, photo1)
        .then(async (snapshot) => {
          console.log("Uploaded a blob or file!");

          const data = await getDownloadURL(storageRef).then((url) => url);

          return data;
        })
        .catch((e) => {
          return false;
        });

      return hasil;
    },
    async uploadFiles(file, fileNm) {
      const filenya = this.convertBase64ToBlob(
        "data:image/(png|jpg|jpeg);base64," + file
      );
      const metadata = {
        name: this.form.no_pol + "_" + fileNm + "_" + this.getNowDate(),
        mimeType: filenya.type,
        parents: [this.folderIDDate],
      };

      const formData = new FormData();
      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      formData.append(
        "file",
        filenya,
        fileNm + "_" + this.getNowDate() + ".jpg"
      );

      console.log(this.folderIDDate);
      const postEmail = await axios
        .post(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
          formData,
          {
            headers: {
              accept: "application/json",
              "Accept-Language": "en-US,en;q=0.8",
              "Content-Type": `application/json; boundary=${formData._boundary}`,
              "Mime-Type": "image/jpg",
              Authorization:
                "Bearer " + this.userData._tokenResponse.oauthAccessToken,
            },
          }
        )
        .then((val) => val)
        .catch((e) => {
          console.log(e.response);
          if (e.response.status === 401) {
            this.$store.commit("AuthStore/AuthStoreMutation", []);
            this.$router.push("/");
          }
        });

      if (postEmail) {
        console.log(postEmail);
        return true;
      } else {
        return false;
      }
    },
    async createFolderGDrive(folderName, parentID = "root") {
      const createFolder = await axios
        .post(
          "https://www.googleapis.com/drive/v3/files",
          {
            name: folderName,
            parents: [parentID],
            mimeType: "application/vnd.google-apps.folder",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + this.userData._tokenResponse.oauthAccessToken,
            },
          }
        )
        .then((val) => val)
        .catch((e) => {
          console.log(e.response);
          if (e.response.status === 401) {
            this.$store.commit("AuthStore/AuthStoreMutation", []);
            this.$router.push("/");
          }
        });

      if (createFolder) {
        return createFolder;
      } else {
        return false;
      }
    },
    async getFolderID(folderName, parentID = "root") {
      const createFolder = await axios
        .get(
          `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
            `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed != true and '${parentID}' in parents`
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + this.userData._tokenResponse.oauthAccessToken,
            },
          }
        )
        .then((val) => val)
        .catch((e) => {
          console.log(e.response);
          if (e.response.status === 401) {
            this.$store.commit("AuthStore/AuthStoreMutation", []);
            this.$router.push("/");
          }
        });

      if (createFolder) {
        return createFolder;
      } else {
        return false;
      }
    },
    getNowDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; // Months start at 0!
      let dd = today.getDate();
      let hh = today.getHours();
      let mms = today.getMinutes();
      let ss = today.getSeconds();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      const todayt = dd + "_" + mm + "_" + yyyy + "_" + hh + mms + ss;

      return todayt;
    },
  },
  watch: {
    form: {
      handler(val) {
        this.$store.commit("AuthStore/ListMutation", { ...val });
      },
      deep: true,
    },
  },
};
</script>