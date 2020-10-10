import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  HostListener,
} from "@angular/core";
import { AudioService } from "src/app/audio.service";
import { of } from "rxjs";
import { GlobalService } from "src/app/global.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { type } from "jquery";
declare var $: any;

interface StreamState {
  playing: boolean;
  readableCurrentTime: string;
  readableDuration: string;
  duration: number | undefined;
  currentTime: number | undefined;
  canplay: boolean;
  error: boolean;
}

@Component({
  selector: "app-lesson",
  templateUrl: "./lesson.component.html",
  styleUrls: ["./lesson.component.scss"],
})
export class LessonComponent implements OnInit {
  carosalHide = true;
  modalConfirmation: any = false;
  loader: any = false;
  max_767_width: any = false;
  goToSentenceFlag: any = false;
  goToSentenceArray: any = null;
  lessonType: any;
  lessonProgress = 0;
  songLoopIndex: any;
  repeatIndex: any;
  speakIndex: any;
  hearStatus = 1;
  btnDisabled = false;
  value: any;
  calculateTimeCall = 0;
  timeInterval: any = 0;
  loopStopWatchTime: any = localStorage.getItem(btoa("time_loop"))
    ? atob(localStorage.getItem(btoa("time_loop")))
    : 0;
  files: Array<any> = [];
  state: StreamState;
  audioLoopIndex = 0;
  currentProgress = 0;
  isSubscribed: any;
  circleImage = {
    pause: "assets/images/playIcon.svg",
    play: "assets/images/pauseIcon.svg",
    refresh: "assets/images/refreshIcon.svg",
  };

  newCircleImage = {
    pause: "assets/images/playNew.png ",
    play: "assets/images/pauseNew.png",
    refresh: "assets/images/repeatNew.png",
  };

  currentFile: any = {};
  currentIndex = 0;
  lessons: Array<any> = [];
  lessonData: any = {};
  circleProgressPercent = 0;
  Interval: any;
  saveProgressInterval: any;

  // save history  after new changes object and variable
  currentState = {
    active: 1,
    passive: 2,
    speak: 3,
    repeat: 4,
  };
  saveHistory = {
    current: 0,
    level_id: 0,
    active: {
      indexArray: [0],
      total: 0,
      max: 1,
    },
    passive: {
      indexArray: [],
      total: 0,
      max: 0,
    },
    speak: {
      indexArray: [0],
      total: 0,
      max: 0,
    },
    repeat: {
      indexArray: [],
      total: 0,
      max: 0,
    },
  };

  constructor(
    private audioService: AudioService,
    public global: GlobalService,
    private route: ActivatedRoute,
    public router: Router,
    private ngxService: NgxUiLoaderService,
    public breakpointObserver: BreakpointObserver,
    public location: Location
  ) {
    this.global.loader = true;
    this.global.profileTab = 1;
    // listen to stream state
    this.audioService.getState().subscribe((state) => {
      this.state = state;
      this.route.paramMap.subscribe((params) => {
        this.lessonType = params.get("id") ? params.get("id") : null;
        console.log(params.get("id"));
        if (this.lessonType != "sentences" && this.lessonType != "demo") {
          location.back();
        }
      });
    });
    this.getSubsriptionStatus();
    if (this.global.isPhone) {
      setTimeout(() => {
        this.carosalHide = false;
      }, 2000);
    } else {
      this.carosalHide = false;
    }
  }
  ngOnInit() {
    this.breakpointObserver
      .observe(["(max-width: 767px)"])
      .subscribe((result) => {
        if (result.matches) {
          this.max_767_width = false;
        } else {
          this.max_767_width = true;
        }
      });
    this.getLessons().then((promise) => {
      // this is slide to current progress section where user read out last time
      $(document).ready(() => {
        console.log("jquery works");
        setTimeout(() => {
          $(".carousel").bind("slide.bs.carousel", (e) => {
            this.onSlide(e);
          });
        }, 3000);
        setTimeout(() => {
          $(".carousel").swipe({
            swipe: (
              event,
              direction,
              distance,
              duration,
              fingerCount,
              fingerData
            ) => {
              let currentIndex = $("div.active").index();
              console.log("swipe", currentIndex, this.currentIndex, direction);
              if (
                direction == "left" &&
                this.currentIndex < this.lessons.length - 1
              ) {
                this.currentIndex = this.currentIndex + 1;
                //this.switchSlide(this.currentIndex);
                $(".lists_" + this.currentIndex).trigger("click");
              }
              if (direction == "right" && this.currentIndex != 0) {
                this.currentIndex = this.currentIndex - 1;
                //this.switchSlide(this.currentIndex);
                $(".lists_" + this.currentIndex).trigger("click");
              }
            },
            allowPageScroll: "vertical",
          });

          $(".touch-event").on("touchend", function (e) {
            $(this).trigger("click");
            return;
          });
        }, 1000);
        if (
          this.global.max_read_slide &&
          this.global.max_read_slide != null &&
          this.global.max_read_slide !== 0
        ) {
          setTimeout(() => {
            $(".lists_" + +this.global.max_read_slide).trigger("click");
            console.log(
              "slide function ",
              ".lists_" + +this.global.max_read_slide
            );
            this.switchSlide(this.global.max_read_slide);
            return;
          }, 1000);
          return;
        }
      });
    });
    // $('#video-carousel-example2').carousel({
    //   interval: 2000
    // });

    // $('#video-carousel-example2').bind('slid', function () {
    //   currentIndex = $('div.active').index() + 1;
    //   console.log(currentIndex + '/' + totalItems);
    // });
  }

  //clear the current sound on navigation
  ngOnDestroy() {
    this.audioService.stop();
    clearInterval(this.Interval);
    clearInterval(this.saveProgressInterval);
    this.updateLessonProgress(
      this.global.lesson_id,
      this.global.lessonfamily_id,
      this.global.baselesson_id,
      this.lessons.length,
      this.lessonProgress,
      this.lessonType
    );
  }

  // set interval to update the percentage of ng progress bar according to current audio duration
  // here duration update the progress according to pass value
  interval(duration, isLoop = 0) {
    this.Interval = setInterval(() => {
      let currentIndex = $("div.active").index();
      if (currentIndex != this.currentIndex && !this.goToSentenceFlag) {
        this.switchSlide(currentIndex);
      }
      this.circleProgressPercent =
        isLoop === 1
          ? (this.currentProgress / this.timeInterval) * 100
          : (this.state.currentTime / this.state.duration) * 100;
      this.currentProgress = this.currentProgress + 0.35;
      if (this.state.currentTime >= this.state.duration && isLoop === 0) {
        clearInterval(this.Interval);
        this.currentProgress = 0;
        this.circleProgressPercent = 0;
      }
      if (this.currentProgress >= this.timeInterval && isLoop === 1) {
        clearInterval(this.Interval);
        this.currentProgress = 0;
        this.circleProgressPercent = 0;
      }
    }, duration);
  }

  playStream(url) {
    this.audioService.playStream(url).subscribe((events) => {
      // listening for fun here
    });
  }

  // using this we assign a audio file in audio service instance this content the reference of current playing audio
  openFile(file, i, loopIndex = -1) {
    let index = i;
    // loopIndex = -1 is for audio who play as playlist or in loop
    if (loopIndex != -1) {
      index = i + "i" + loopIndex;
      if (
        this.currentFile.index != index ||
        this.currentFile.index == undefined
      ) {
        // here we check if currently there is audio playing then we stop it
        this.audioService.stop();
        this.playStream(file);
      }

      // if the audios play in loop then we add two index first is the lesson array's index and second is for audios array data's index by doing this we can easily maintain the state of current playing audio in loop

      this.currentFile = { index, file };
    } else {
      // this condition is applicable in case when there is only single audio is present
      if (this.currentFile.index != i || this.currentFile.index == undefined) {
        // here we check if currently there is audio playing then we stop it
        this.audioService.stop();
        this.playStream(file);
      }
      index = i;
      this.currentFile = { index, file };
    }
  }

  // this pause the current playing audio and we also clear the interval which is used for Show progress bar
  pause() {
    //  alert(this.state.currentTime)
    this.audioService.pause();
    // this.circleProgressPercent =
    //   (this.state.currentTime / this.state.duration) * 100;
    clearInterval(this.Interval);
  }

  // method is call when we play single audio sound of lessons array
  play(file, index, speed = 1) {
    this.currentIndex = index;

    let currentIndex = $("div.active").index();
    if (currentIndex != this.currentIndex && !this.goToSentenceFlag) {
      this.switchSlide(currentIndex);
      return;
    }
    // because this is for single audio file so we assign 0 to  this.audioLoopIndex which is used to maintain the current playing index of a audio in loop
    this.audioLoopIndex = 0;
    if (this.state.playing && this.currentFile.index == index) {
      // here we check when we click on play button if audio is already play then we pause it
      this.lessons[index]["toggle"] = "pause";
      this.pause();
    } else {
      this.lessons[index]["toggle"] = "play";

      this.openFile(file, index);
      //here we set interval for 950 mili seconds interval
      this.interval((1 / speed) * 360);

      // this call back is call when the current playing audio is completed
      this.audioService.play(speed).then((data) => {
        this.circleProgressPercent = 100;
        // here we update progress circle image for audio refreshing state
        this.lessons[index]["toggle"] = "refresh";
        console.log(data);
        // clear the progress interval
        clearInterval(this.Interval);
        // set the progress values to 0
        setTimeout(() => {
          this.currentProgress = 0;
          this.circleProgressPercent = 0;
        }, 300);
      });
    }
  }

  // when user click on a particular sentence then play that particular sentence audio
  playSentence(files, index, speed = 1, loopIndex) {
    this.audioLoopIndex = loopIndex;
    clearInterval(this.Interval);
    this.audioService.stop();
    this.currentFile = {};
    this.currentProgress = 0;
    this.circleProgressPercent = 0;
    this.playLoop(files, index, speed, 0);
  }

  // method is call when we play audios  in loop  of lessons array
  async playLoop(files, index, speed = 1, isLoop = 0) {
    this.currentIndex = index;
    console.log(this.currentFile.index);

    let currentIndex = $("div.active").index();
    if (currentIndex != this.currentIndex && !this.goToSentenceFlag) {
      this.switchSlide(currentIndex);
      return;
    }

    // here we calculating the  index of current playing audio of lesson array
    let str = (this.currentFile.index + "").substr(
      0,
      (this.currentFile.index + "").indexOf("i")
    );
    console.log("str", +str);

    // here we check if the current slide index is not match with current playing audio index and the audio loop array index is greater then 0
    // if (str != index && this.audioLoopIndex > 0) {
    //   // this.audioLoopIndex  is used to maintain the audio condition which is playing in loop as playlist
    //   this.audioLoopIndex = 0;
    // }
    if (this.state.playing && +str == index) {
      clearInterval(this.Interval);
      this.pause();
      this.lessons[index]["toggle"] = "pause";
      return;
    } else {
      this.lessons[index]["toggle"] = "play";
      // get the sound url from array
      let fileArray = files.filter((ele, j) => {
        if (j >= this.audioLoopIndex) {
          return ele;
        }
      });
      console.log("fileArray", fileArray);

      // get count and last index of sound array
      let lastIndex = fileArray.length - 1;
      await fileArray.reduce(async (promise, file, i) => {
        await promise;
        this.openFile(file.sound, index, i);

        this.interval((1 / speed) * 360, isLoop);

        const contents = await this.audioService.play(
          speed,
          true,
          this.Interval
        );
        this.audioLoopIndex++;

        clearInterval(this.Interval);
        if (isLoop === 0) {
          this.scroll("scroll-" + index + "" + i);
        }
        if (isLoop === 0) {
          setTimeout(() => {
            this.currentProgress = 0;
            this.circleProgressPercent = 0;
          }, 300);
        }
        if (lastIndex == i) {
          // here we check if last sound of array  playing then refresh it
          this.lessons[index]["toggle"] = "refresh";
          this.audioLoopIndex = 0;
          // this condition is used to update the timer in songLoop condition
          if (this.lessons[this.currentIndex]["type"] == "songLoop") {
            this.calculateTime(this.lessons[this.currentIndex].data);
          }
          if (isLoop === 0) {
            let el = document.getElementById("scroll-" + index + "" + 0);
            el.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "start",
            });
          }
          if (isLoop === 1) {
            clearInterval(this.Interval);
            this.currentProgress = 0;
            this.circleProgressPercent = 0;
            setTimeout(async () => {
              await this.playLoop(files, index, 1, 1);
            }, 1000);
            this.currentFile = {};
          }
        }
        console.log(contents);
      }, Promise.resolve());
    }
  }

  getFiles() {
    console.log(of(this.files));
    return of(this.files);
  }

  calculateTime(data) {
    console.log("data", data);
    this.timeInterval = 0;
    data.reduce(async (promise, file) => {
      await promise;
      let data = await this.getDuration(file.sound);
      console.log("data", file);
      this.timeInterval = this.timeInterval + data;
      console.log(this.timeInterval);
    }, Promise.resolve());
    this.timeInterval = this.timeInterval;
    return this.timeInterval;
  }

  getDuration(src) {
    console.log("src", src);
    return new Promise((resolve, reject) => {
      var audio = new Audio();
      audio.src = src;
      //audio.load()
      // audio.play()
      audio.onloadedmetadata = () => {
        // console.log(audio.duration)
        resolve(Math.round(audio.duration));
      };
    });
  }

  stopAudio(position) {
    if (
      this.lessons[position] &&
      this.lessons[position]["type"] &&
      this.lessons[position]["type"] == "songLoop"
    ) {
      this.hearStatus = 2;
      //this.songLoopIndex = position;
      this.calculateTime(this.lessons[position].data);
    }
    if (this.lessons[position] && this.lessons[position]["toggle"]) {
      this.lessons[position]["toggle"] = "pause";
    }
    //console.log("current position", position);
    this.currentFile = {};
  }

  updateIndex(boolean) {
    if (this.btnDisabled) {
      return;
    }
    this.btnDisabled = true;
    setTimeout(() => {
      this.btnDisabled = false;
    }, 600);
    console.log("i am called");
    clearInterval(this.Interval);
  }

  // this function maintain the selection of a particular slide from Drop down
  switchSlide(index) {
    this.goToSentenceFlag = false;
    console.log("switch Index", index);
    clearInterval(this.Interval);
    //this.currentIndex = index;
    this.stopAudio(index);
    this.audioService.stop();
    this.currentFile = {};
    this.currentProgress = 0;
    this.audioLoopIndex = 0;
    this.circleProgressPercent = 0;
    // if (this.lessonProgress < this.currentIndex) {
    this.lessonProgress = this.currentIndex;
    // }
  }

  // to handle when click  on hear status buttons
  hearFunction(status) {
    this.goToSentenceFlag = false;
    this.hearStatus = status;
  }

  getLessons() {
    return new Promise((resolve, reject) => {
      this.global.loader = true;
      let slug = "app-demo";
      let body = {};
      if (this.lessonType == "sentences") {
        if (this.isSubscribed === 0) {
          this.global.showWarningToast(
            this.global.termsArray["msg_please_subscribe"]
          );
          this.router.navigate(["account"]);
          this.global.loader = false;
          return;
        }
        slug = "sentencesByLessonId";
        body["lesson_id"] = this.global.lesson_id;
        body["baselesson_id"] = this.global.baselesson_id;
      }
      body["language_id"] = this.global.selectLanguage;
      body["learning_language_id"] = this.global.user.learning_language_id;
      body["user_id"] = this.global.user._id;
      this.global.post(
        slug,
        body,
        (data) => {
          if (data.success) {
            console.log("lesson", JSON.stringify(data.data));

            if (this.lessonType == "sentences") {
              let pop = data.data.sentenceslist.pop();
              this.goToSentenceArray = pop;
              data.data.sentenceslist.push(pop);
            }

            this.lessons =
              data.data[
                this.lessonType == "sentences" ? "sentenceslist" : "demo"
              ];
            this.lessonData["progress"] = data.data.progress;
            this.lessonData["stateCount"] =
              data.data[this.lessonType == "sentences" ? "test" : "stateCount"];

            this.global.max_read_slide = this.lessonData["progress"].current;

            this.fillSaveHostroy(
              this.lessonData["progress"],
              this.lessonData["stateCount"]
            );

            if (this.lessons.length > 0) {
              this.setIntervalToStoreProgress();
            } else {
              this.loader = true;
            }
            this.lessons.map((ele, index) => {
              if (ele.sentence1 && ele.sentence2) {
                ele["sentenceArray"] = this.sentenceToArray(ele);
              }
              if (
                ele.type == "slow_song_with_sentence" ||
                ele.type == "fast_song_with_sentence"
              ) {
                ele["data"] = ele.data.map((ele2, index) => {
                  if (ele2.sentence1) {
                    ele2["sentenceArray"] = this.sentenceToArray(ele2);
                    return ele2;
                  }
                });
              }
              if (ele.type == "songLoop") {
                this.songLoopIndex =
                  this.lessonType == "sentences" ? index : index;
                this.calculateTime(ele.data);
              } else if (ele.type == "slow_song_with_sentence") {
                this.speakIndex =
                  this.lessonType == "sentences" ? index : index;
              } else if (ele.type == "sentenceList") {
                this.repeatIndex = index - 1;
              }
            });
            resolve(true);
          } else {
            this.loader = true;
            reject(false);
            this.global.showToast("", this.global.termsArray[data.message]);
          }
        },
        (err) => {
          this.ngxService.stop();
          reject(false);
          this.global.showDangerToast(err.message);
        },
        true,
        2000
      );
      console.log(this.lessons);
    });
  }

  updateLessonProgress(
    lesson_id,
    family_id,
    base_id,
    total,
    lessonProgress,
    lessonType
  ) {
    console.log(
      "lessonProgress =>",
      this.global.lesson_id,
      this.global.lessonfamily_id
    );
    let body = {};
    body["lesson_id"] = lesson_id;
    if (lessonType == "sentences") {
      body["lessonfamily_id"] =
        this.lessonType == "sentences" ? family_id : null;
    }
    body["total"] = total;
    // here we check if reading index is equal to full array length then we remove one step before
    body["current"] = this.saveHistory.current;
    body["level_id"] = this.saveHistory.level_id;
    body["is_demo"] = lessonType == "sentences" ? 2 : 1;
    body["active"] = this.saveHistory.active;
    body["passive"] = this.saveHistory.passive;
    body["speak"] = this.saveHistory.speak;
    let repeat = {
      indexArray: [],
      total: this.lessonData["stateCount"].repeat,
      max: 0,
    };
    body["repeat"] = this.modalConfirmation ? this.saveHistory.repeat : repeat;
    if (this.value.count) {
      body["time_loop"] = +this.value.count;
    }
    if (this.lessons.length > 0) {
      this.global.post(
        "saveLessonHistory",
        JSON.stringify(body),
        (data) => {
          console.log(data);
          // this.global.lessonfamily_id = null
          // this.global.baselesson_id = null
          // this.global.lesson_id = null
          // localStorage.removeItem("lessonfamily_id")
          // localStorage.removeItem("baselesson_id")
          // localStorage.removeItem("lesson_id")
        },
        (err) => {
          //this.global.showDangerToast(err.message)
        },
        false
      );
    }
  }

  setIntervalToStoreProgress() {
    let lastProgress: any = null;
    let lastLoopTime: any = null;
    this.saveProgressInterval = setInterval(() => {
      let currentIndex = $("div.active").index();
      if (currentIndex != this.currentIndex && !this.goToSentenceFlag) {
        this.switchSlide(currentIndex);
        return;
      }

      if (
        lastProgress != this.lessonProgress ||
        lastLoopTime != this.value.count
      ) {
        lastProgress = this.lessonProgress;
        lastLoopTime = this.value.count;
        this.updateLessonProgress(
          this.global.lesson_id,
          this.global.lessonfamily_id,
          this.global.baselesson_id,
          this.lessons.length,
          this.lessonProgress,
          this.lessonType
        );
      }
    }, 5000);
  }
  getSubsriptionStatus() {
    this.global.get(
      "getSubsriptionStatus",
      (data) => {
        if (data.success) {
          this.isSubscribed = data.data.is_subsribed;
        }
      },
      (err) => {},
      true
    );
  }
  navigate(slug = null) {
    clearInterval(this.Interval);
    clearInterval(this.saveProgressInterval);
    this.global.profileTab = 1;
    if (slug) {
      this.router.navigate([slug], { replaceUrl: true });
    } else {
      this.router.navigate(["choose-lesson"], { replaceUrl: true });
    }
  }
  scroll(id) {
    console.log(`scrolling to ${id}`);
    let el = document.getElementById(id);
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
  }

  //covert the sentence into word to word translation
  sentenceToArray(data) {
    let sentence1 = data.sentence1.trim().split(" ");
    let sentence2 =
      data.sentence2 && data.sentence2.trim()
        ? data.sentence2.trim().split(" ")
        : "";
    let sentence3 =
      data.latin_sentence && data.latin_sentence.trim()
        ? data.latin_sentence.trim().split(" ")
        : "";
    let newArray = [];
    sentence1.forEach((element, k) => {
      let obj = {};
      obj["sentence1"] = element.split("*").join(" ");
      obj["sentence2"] = sentence2[k] ? sentence2[k].split("*").join(" ") : "";
      obj["sentence3"] = sentence3[k] ? sentence3[k].split("*").join(" ") : "";
      if (sentence3.length > 0) {
        if (k == 0) {
          obj["sentence3"] = "[" + obj["sentence3"];
        }
        if (k == sentence1.length - 1) {
          obj["sentence3"] = obj["sentence3"] + "]";
        }
      }
      newArray.push(obj);
    });
    return newArray;
  }

  //go to sentence screen
  goToSentence() {
    this.goToSentenceFlag = false;
    clearInterval(this.Interval);
    this.stopAudio(this.currentIndex);
    if (this.lessons.length > this.currentIndex) {
      this.currentIndex++;
    }
    this.audioService.stop();
    this.currentFile = {};
    this.currentProgress = 0;
    this.audioLoopIndex = 0;
    this.circleProgressPercent = 0;
  }

  // add the slide in array

  addSlideInArray(item, state, index) {
    this.saveHistory.current = index;
    if (
      this.saveHistory[state] &&
      this.saveHistory[state].indexArray.indexOf(item) == -1
    ) {
      this.saveHistory[state].indexArray.push(item);
      this.saveHistory[state].max = this.saveHistory[state].max + 1;
    }
    console.log(this.saveHistory);
  }

  onSlide(e) {
    clearInterval(this.Interval);
    this.stopAudio(e.from);
    this.stopAudio(this.currentIndex);
    this.audioService.stop();
    this.currentFile = {};
    this.currentProgress = 0;
    this.audioLoopIndex = 0;
    this.circleProgressPercent = 0;
    // get current index from slide event
    this.currentIndex = e.to;
    this.lessonProgress = this.currentIndex;
    this.scrollDot("scroll-dot-" + this.currentIndex);

    // open modal

    if (
      this.lessons[this.currentIndex].state == "final" ||
      this.lessons.length - 1 == this.currentIndex
    ) {
      $("#open-modal").trigger("click");
    }

    this.hearStatus = this.currentState[this.lessons[this.currentIndex].state]
      ? this.currentState[this.lessons[this.currentIndex].state]
      : 4;

    // if (this.currentIndex >= 0 && this.currentIndex < this.songLoopIndex - 1) {
    //   this.hearStatus = 1;
    // } else if (
    //   this.currentIndex >= this.songLoopIndex - 1 &&
    //   this.currentIndex < this.speakIndex - 1
    // ) {
    //   this.hearStatus = 2;
    // } else if (
    //   this.currentIndex >= this.speakIndex - 1 &&
    //   this.currentIndex < this.repeatIndex
    // ) {
    //   this.hearStatus = 3;
    // } else if (this.currentIndex >= this.repeatIndex) {
    //   this.hearStatus = 4;
    // }

    // save hostory data

    this.addSlideInArray(e.to, this.lessons[this.currentIndex].state, e.to);
  }

  fillSaveHostroy(object, total) {
    this.loopStopWatchTime = object.time_loop ? object.time_loop : 0;
    this.saveHistory.current = object.current;
    this.saveHistory.level_id = object.level_id;

    this.currentIndex = object.current;
    this.hearStatus = this.currentState[this.lessons[this.currentIndex].state]
      ? this.currentState[this.lessons[this.currentIndex].state]
      : 4;

    this.saveHistory.active.indexArray =
      typeof object.active_indexArray == "object" &&
      object.active_indexArray.length >= 1
        ? object.active_indexArray
        : [0];
    this.saveHistory.active.max =
      object.active_read && object.active_read >= 1 ? object.active_read : 1;
    this.saveHistory.active.total = total.active;

    this.saveHistory.passive.indexArray =
      typeof object.passive_indexArray == "object"
        ? object.passive_indexArray
        : [];
    this.saveHistory.passive.max = object.passive_read;
    this.saveHistory.passive.total = total.passive;

    this.saveHistory.speak.indexArray =
      typeof object.speak_indexArray == "object" ? object.speak_indexArray : [];
    this.saveHistory.speak.max = object.speak_read;
    this.saveHistory.speak.total = total.speak;
    this.saveHistory.repeat.indexArray =
      typeof object.repeat_indexArray == "object"
        ? object.repeat_indexArray
        : [];
    this.modalConfirmation =
      typeof object.repeat_indexArray == "object" &&
      object.repeat_indexArray.length == total.repeat
        ? true
        : false;
    this.saveHistory.repeat.max = object.repeat_read;
    this.saveHistory.repeat.total = total.repeat;
  }
  scrollDot(id) {
    console.log(`scrolling to ${id}`);
    let el = document.getElementById(id);
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }
  percent() {
    return this.value && this.value.count ? (this.value.count / 1200) * 100 : 0;
  }
  modalConfirmationFill() {
    console.log(this.saveHistory);
    this.modalConfirmation = true;
  }
}
