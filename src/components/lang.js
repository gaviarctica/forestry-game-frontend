// Edit this file to change texts in the UI.
//
// To add a new language, copy eg. the
//   en: {
//     ...(everything that's inside)...
//   }
// part to the end of the LANG object,
// change the ID (eg. 'en' to 'se' for Swedish)
// and translate the texts on the new language.
// Also add the new language's ID to the file
// LangSelection.jsx.

export const LANG = {
  // English
  en: { // <-- Language ID
    langName: "English", // The name that will be shown in UI
    icon: "/static/flag-en.png", // Path to the flag image
    navbar: {
      play: "Play",
      profile: "Profile",
      editor: "Editor",
      help: "Help",
      logOut: "Log out",
      logIn: "Log in",
      signUp: "Sign up",
      settings: "Settings"
    },
    mainMenu: {
      settings: {
        language: "Language",
        graphics: "Graphics",
        high: "High",
        low: "Low",
        about: "About"
      },
      playTab: {
        pileTypesAndAmounts: "Pile Types and Amounts",
        routeLength: "Route Length",
        storageAreaAmount: "Storage Area Amount",
        roadAnomalies: "Road Anomalies",
        yes: "Yes",
        no: "No",
        weather: "Weather",
        foggy: "Foggy",
        clear: "Clear",
        show: "Show",
        search: "Search",
        defaultLevels: "Default levels",
        myLevels: "My levels",
        messages: {
          noLevelsFound: "No levels were found",
          noOfficialLevels: "No default levels have been set"
        }
      },
      profileTab: {
        profile: "Profile",
        noScoresFound: "You don't have any scores yet!",
        timestamp: "Time",
        cost: "Cost",
        map: "Level",
        info: "Info",
        search: "Search levels.."
      },
      loginSignupForm: {
        username: "username",
        password: "password",
        email: "email",
        messages: {
          wrongUsernameOrPassword: "Wrong username or password",
          usernameExists: "That username already exists",
          emailExists: "An account with that email address already exists",
          usernameRequired: "Please enter a username",
          passwordRequired: "Please enter a password",
          emailRequired: "Please enter an email address",
          usernameTooShort: "Username must be between 3 and 15 characters in length",
          usernameTooLong: "Username must be between 3 and 15 characters in length",
          passwordTooShort: "Password must be between 6 and 50 characters in length",
          passwordTooLong: "Password must be between 6 and 50 characters in length",
          emailInvalid: "Please enter a valid email address"
        }
      }
    },
    report: {
      report: "Report",
      map: "Map",
      stats: "Stats",
      workingTime: "Working time",
      distanceTravelled: "Distance travelled",
      fuelConsumed: "Fuel consumed",
      logsCollected: "Logs collected",
      finalCost: "Total cost",
      close: "Close",
      details: "Show details",
      dismissDetails: "Dismiss details"
    },
    detailedReport: {
      time: "Time (hh:mm:ss)",
      workingTime: "Working time",
      drivingUnloadedTime: "Driving unloaded",
      drivingLoadedTime: "Driving loaded",
      loadingUnloadingTime: "Loading & Unloading",
      idling: "Idling",

      distance: "Distance (m)",
      distanceTravelled: "Distance travelled",
      drivingForwardTime: "Driving forward",
      drivingBackwardTime: "Reverse",
      drivingUnloadedDistance: "Driving unloaded",
      drivingLoadedDistance: "Driving loaded",

      costTitle: "Cost (€)",
      fuelConsumed: "Fuel consumed",
      fuelCost: "Fuel cost",
      workerSalary: "Worker salary",

      productivityTitle: "Productivity",
      loadsTransported: "Loads transported (pc.)",
      logsDeposited: "Logs deposited (pc.)",
      totalVolume: "Total volume (m3)",
      productivity: "Productivity (m3/h)"
    },
    game: {
      time: "Time",
      distance: "Distance",
      fuelConsumed: "Fuel consumed",
      cost: "Cost",
      logsRemaining: "Logs remaining",
      levelFinished: 'Level finished!'
    },
    editor: {
      selectedTool: "Selected tool",
      tools: "Tools",
      toolType: "Tool type",
      free: "Free",
      normalRoad: "Normal road",
      dyingRoad: "Crossing limited road",
      weightLimitedRoad: "Weight limited road",
      onewayRoad: "One-way road",
      saveAsNewLevel: "Save as new level",
      weather: "Weather",
      enableFog: "Enable fog",
      fogDensity: "Density",
      fogVisibility: "Visibility",
      info: "Info",
      toolInfo: {
        road: "Click anywhere to draw a road. Double click to end the road.",
        roadWeightlimit: "Click the middle of a road segment to apply a weight limit. Adjust the weight limit value by hovering over the current value and using number keys or the mouse wheel.",
        roadDying: "Click the middle of a road segment to apply a crossing limit. Adjust the crossing limit value by hovering over the current value and using number keys or the mouse wheel.",
        roadOneway: "Click the middle of a road segment to make it a one way road. Click again to change direction.",
        log: "Click anywhere next to a road to place a log. You can select the assortment type with the tool type dropdown menu.",
        deposit: "Click anywhere next to a road to place a deposit. You can select the accepted assortment type with the tool type dropdown menu.",
        truck: "Click anywhere on a road to set the truck starting position. Change the starting direction with right click.",
        remove: "Click anything to remove it from the level."
      },
      messages: {
        levelSaved: "Level saved",
        levelLoaded: "Level loaded",
        levelDeleted: "Level deleted",
        levelInvalid: "Level doesn`t have truck or logs or there is not enough log deposits for different log types",
        fogInvalid: "Level fog visibility values are invalid"
      },
      confirmMessages: {
        deleteConfirm: "Are you sure you want to delete this level?",
        overwriteConfirm: "Are you sure you want to overwrite your previously saved level?"
      }
    },
    buttons: {
      startGame: "Start game",
      logIn: "Log in",
      signUp: "Sign up",
      loadingSignUp: "Signing up... please wait!",
      loadingLogIn: "Logging in... please wait!",
      quit: "Quit",
      report: "Report",
      road: "Road",
      anomalies: "Anomalies",
      logs: "Logs",
      deposits: "Deposits",
      truck: "Truck",
      remove: "Remove",
      save: "Save",
      saveAs: "Save as",
      loadLevel: "Load level",
      menu: "Menu",
      back: "Back",
      cancel: "Cancel",
      yes: "Yes",
      no: "No"
    },
    logs: {
      type1: "Birch sawlog",
      type2: "Pine sawlog",
      type3: "Spruce sawlog",
      type4: "Birch pulp",
      type5: "Pine pulp",
      type6: "Spruce pulp",
    },
    help: {
      gameplay: {
        gameplay: "Gameplay",
        gameplayintro: `Goal of the game is to transfer all the logs in the working area and unload them into unloading stations 
                        in the most optimal way. The evaluation criteria depends on working time, driving distance, and overall cost. 
                        A game is completed when all the logs are unloaded to their respective unloading stations, and a report is produced
                        which includes statistics from the training session.`,
        gameplaydescription: `A worksite can contain several types of logs. Each log weighs 50kg regardless of the type. 
                              A deposit will hold only 1 type of log. A deposit will be assigned a log type once a log is deposited to it.
                              A deposit can be pre-assigned to contain only certain types of logs in the editor. Once logs have been deposited to a certain deposit,
                              the logs cannot be removed from it. The truck's speed will be affected by the amount of logs loaded in the truck, and 
                              reverse driving also affects the speed. Each log loading and unloading operation takes 15 seconds.`,
        conditions: "Conditions",
        normalMenu: "Normal",
        limitedcrossingMenu: "Limited crossings",
        weightlimitMenu: "Weight-limit",
        onewayMenu: "One-way limit",
        fogMenu: "Fog",
        conditionsDescription: `There are a few road and weather conditions that the driver must take into account when working in a worksite.
                                Check these conditions by selecting from the dropdown below.`,
        normalDescription: `A worksite with normal conditions. Clear weather and roads have no limits.`,
        dyingDescription: `This worksite contains a muddy road in the middle that can be crossed a maximum of 4 times.`,
        weightDescription: `This worksite contains a weight-limited road which shows the maximum load you can have in addition to the truck. 
                            One log weighs 50kg.`,
        onewayDescription: `This worksite contains a one-way road. The arrows represents the direction a truck can drive.`,
        fogDescription: `This worksite is foggy which limits the visibility.`,
      },
      controls: {
        controls: "Controls",
        controls1: "1. Use Arrow keys or WASD-keys to control the truck.",
        controls2: "2. Use Q and E buttons to select log for picking or unloading station for unloading.",
        controls3: "3. Use keys 1-6 to show/hide logs on map.",
        controls4: "4. Use Space to pick or unload a log.",
        controls5: "5. Alternatively use Mouse left click to pick or unload a log.",
        controls6: "6. Hold Mouse right button and drag to move camera.",
        controls7: "7. Zoom in and out with Mouse middle button. Hold and drag to move camera."
      },
      editor: {
        editor: "Editor",
        roadtoolMenu: "Road tool",
        logstoolMenu: "Log tool",
        deposittoolMenu: "Deposit tool",
        trucktoolMenu: "Truck tool",
        removetoolMenu: "Remove tool",
        roadtool: `With a Road tool you can make roads by clicking to a startpoint and to a desired endpoint.
                   Double click to deselect the tool. Road conditions can also be set with a road tool.`,
        logstool: `Use log tool to place logs in the working area.`,
        deposittool: `Use deposit tool to place deposits in the working area.`,
        trucktool: `Use truck tool to put a truck to your desired starting point and position. Swap the orientation with mouse right click.`,
        removetool: `Use remove tool to remove objects from the working area.`,
      }
    }
  },


  // Finnish
  fi: {
    langName: "Suomi",
    icon: "/static/flag-fi.png",
    navbar: {
      play: "Pelaa",
      profile: "Profiili",
      editor: "Editori",
      help: "Ohje",
      logOut: "Kirjaudu ulos",
      logIn: "Kirjaudu sisään",
      signUp: "Rekisteröidy",
      settings: "Asetukset"
    },
    mainMenu: {
      settings: {
        language: "Kieli",
        graphics: "Grafiikka",
        high: "Korkea",
        low: "Matala",
        about: "Tietoja"
      },
      playTab: {
        pileTypesAndAmounts: "Puutyypit ja lukumäärät",
        routeLength: "Tien pituus",
        storageAreaAmount: "Säilytysalueet",
        roadAnomalies: "Tiemuuttujat",
        yes: "Kyllä",
        no: "Ei",
        weather: "Sää",
        foggy: "Sumuinen",
        clear: "Selkeä",
        show: "Näytä",
        search: "Haku",
        defaultLevels: "Oletustasot",
        myLevels: "Omat tasot",
        messages: {
          noLevelsFound: "Haulla ei löytynyt tasoja",
          noOfficialLevels: "Yhtään oletustasoja ei ole määritetty"
        }
      },
      profileTab: {
        profile: "Profiili",
        noScoresFound: "Sinulla ei ole vielä tuloksia!",
        timestamp: "Aika",
        cost: "Kulut",
        map: "Taso",
        info: "Tiedot",
        search: "Etsi tasoja.."
      },
      loginSignupForm: {
        username: "käyttäjänimi",
        password: "salasana",
        email: "sähköposti",
        messages: {
          wrongUsernameOrPassword: "Väärä käyttäjänimi tai salasana",
          usernameExists: "Käyttäjänimi on varattu",
          emailExists: "Sähköpostiosoite on varattu",
          usernameRequired: "Käyttäjänimi vaaditaan",
          passwordRequired: "Salasana vaaditaan",
          emailRequired: "Sähköpostiosoite vaaditaan",
          usernameTooShort: "Käyttäjänimen on oltava 3-15 merkkiä pitkä",
          usernameTooLong: "Käyttäjänimen on oltava 3-15 merkkiä pitkä",
          passwordTooShort: "Salasanan on oltava 6-50 merkkiä pitkä",
          passwordTooLong: "Salasanan on oltava 6-50 merkkiä pitkä",
          emailInvalid: "Syötä sähköpostiosoite oikeassa muodossa"
        }
      }
    },
    report: {
      report: "Raportti",
      map: "Kartta",
      stats: "Tilastot",
      workingTime: "Työskentelyaika",
      distanceTravelled: "Matkustettu etäisyys",
      fuelConsumed: "Polttoaineen kulutus",
      logsCollected: "Puita kerätty",
      finalCost: "Työn kulut",
      close: "Sulje",
      details: "Näytä tilastot",
      dismissDetails: "Sulje tilastot"
    },
    detailedReport: {
      time: "Aika (tt:mm:ss)",
      workingTime: "Työskentelyaika",
      drivingUnloadedTime: "Tyhjällä kuormalla ajo",
      drivingLoadedTime: "Lastin kanssa ajo",
      loadingUnloadingTime: "Lastaus & Tyhjennys",
      idling: "Toimeton",

      distance: "Matka (m)",
      distanceTravelled: "Matkustettu etäisyys",
      drivingForwardTime: "Eteenpäin ajo",
      drivingBackwardTime: "Peruuttaminen",
      drivingUnloadedDistance: "Tyhjällä kuormalla ajo",
      drivingLoadedDistance: "Lastin kanssa ajo",

      costTitle: "Kulut (€)",
      fuelConsumed: "Polttoaineen kulutus",
      fuelCost: "Polttoaineen kokonaishinta",
      workerSalary: "Työntekijän palkka",

      productivityTitle: "Productivity",
      loadsTransported: "Lasteja kuljetettu (kpl)",
      logsDeposited: "Puita kuljetettu (kpl)",
      totalVolume: "Kokonaistilavuus (m3)",
      productivity: "Tuottavuus (m3/t)"
    },
    game: {
      time: "Aika",
      distance: "Matka",
      fuelConsumed: "Polttoaine",
      cost: "Kustannukset",
      logsRemaining: "Tukkeja jäljellä",
      levelFinished: 'Taso läpäisty!'
    },
    editor: {
      selectedTool: "Valittu työkalu",
      tools: "Työkalut",
      toolType: "Työkalun tyyppi",
      free: "Vapaa",
      normalRoad: "Normaali tie",
      dyingRoad: "Ylitysrajoitettu tie",
      weightLimitedRoad: "Painorajoitettu tie",
      onewayRoad: "Yksisuuntainen tie",
      saveAsNewLevel: "Tallenna uutena tasona",
      weather: "Säätila",
      enableFog: "Sumu",
      fogDensity: "Tiheys",
      fogVisibility: "Näkyvyys",
      info: "Tietoja",
      toolInfo: {
        road: "Klikkaa piirtääksesi tie. Lopeta piirto tuplaklikkaamalla.",
        roadWeightlimit: "Klikkaa tiesegmentin keskikohtaa lisätäksesi painorajoituksen. Voit säätää painorajoitusta pitämällä hiirtä rajoitusarvon päällä ja käyttämällä numeronäppäimiä tai hiiren rullaa.",
        roadDying: "Klikkaa tiesegmentin keskikohtaa lisätäksesi ylitysrajoituksen. Voit säätää ylitysrajoitusta pitämällä hiirtä rajoitusarvon päällä ja käyttämällä numeronäppäimiä tai hiiren rullaa.",
        roadOneway: "Klikkaa tiesegmentin keskikohtaa tehdäksesi siitä yksisuuntaisen. Klikkaa uudestaan vaihtaaksesi suuntaa.",
        log: "Klikkaa tien vierusta asettaaksesi tukin. Voit muuttaa puutavaralajia työkalun tyyppi -valinnalla.",
        deposit: "Klikkaa tien vierusta asettaaksesi säilöntäalueen. Voit muuttaa hyväksyttyä puutavaralajia työkalun tyyppi -valinnalla.",
        truck: "Klikkaa haluamaasi tien kohtaa asettaaksesi aloituspisteen. Vaihda aloitussuuntaa oikealla hiiren painiketta.",
        remove: "Klikkaa mitä vain poistaaksesi sen tasosta."
      },
      messages: {
        levelSaved: "Taso tallennettu",
        levelLoaded: "Taso ladattu",
        levelDeleted: "Taso poistettu",
        levelInvalid: "Tasolla ei ole aloituspistettä tai puutavaraa tai siinä on liian vähän säilöntäalueita eri puutavaralajeille",
        fogInvalid: "Tason sumuasetuksen arvot ovat virheelliset"
      },
      confirmMessages: {
        deleteConfirm: "Tahdotko varmasti poistaa tämän tason?",
        overwriteConfirm: "Tahdotko varmasti tallentaa aiemmin tallennetun tason päälle?"
      }
    },
    buttons: {
      startGame: "Aloita peli",
      logIn: "Kirjaudu sisään",
      signUp: "Rekisteröidy",
      loadingSignUp: "Rekisteröidytään... odota hetki!",
      loadingLogIn: "Kirjaudutaan... odota hetki!",
      quit: "Lopeta",
      report: "Raportti",
      road: "Tie",
      logs: "Tukki",
      truck: "Metsäkone",
      deposits: "Säilö",
      remove: "Poista",
      save: "Tallenna",
      saveAs: "Tallenna nimellä",
      loadLevel: "Lataa taso",
      menu: "Valikko",
      back: "Takaisin",
      cancel: "Peruuta",
      yes: "Kyllä",
      no: "Ei"
    },
    logs: {
      type1: "Koivusahapuu",
      type2: "Mäntysahapuu",
      type3: "Kuusisahapuu",
      type4: "Koivumassa",
      type5: "Mäntymassa",
      type6: "Kuusimassa",
    },
    help: {
      gameplay: {
        gameplay: "Pelaaminen",
        gameplayintro: `Pelin tavoitteena on siirtää kaikki tukit työskentelyalueelta niiden keräyspisteille mahdollisimman kustannustehokkaasti.
                        Pelin loputtua näytetään raportti, jonka arviointiperusteena käytetään työskentelyaikaa, kuljettua matkaa, sekä kustannuksia.
                        Peli on ohi, kun kaikki tukit on kerätty niitä vastaaville keräyspisteille.`,
        gameplaydescription: `Työskentelyalue voi pitää sisällään monta erityyppistä tukkia, joista jokainen painaa 50kg tyypistä riippumatta.
                              Jokaiselle keräyspisteelle voidaan kerätä vain yhtä tukkityyppiä. Keräyspisteelle annetaan tukkityyppi sitten, kun 
                              siihen puretaan ensimmäinen tukki. Tyyppi voidaan myös asettaa etukäteen editorissa. Kun keräyspisteelle on 
                              purettu tukkeja, niitä ei voida enää kerätä pois siitä. Metsäkoneen nopeuteen vaikuttavat tukkien määrä koneessa, sekä
                              peruuttaminen. Jokainen tukin lastausoperaatio vie 15 sekuntia.`,
        conditions: "Olosuhteet",
        normalMenu: "Normaali",
        limitedcrossingMenu: "Ylitysrajoitus",
        weightlimitMenu: "Painorajoitus",
        onewayMenu: "Yksisuuntainen tie",
        fogMenu: "Sumu",
        conditionsDescription: `Työskentelyalueella voi olla myös erikoisteitä ja sääolosuhteita. Tarkista olosuhteet alla olevasta pudotusvalikosta.`,
        normalDescription: `Normaali työskentelyalue. Selkeä sää ja ei erikoisteitä.`,
        dyingDescription: `Tällä työskentelyalueella on mutainen tie, joka voidaan ylittää maksimissaan 4 kertaa.`,
        weightDescription: `Tällä työskentelyalueella on painorajoitettu tie, joka näyttää maksimikuorman, minkä kanssa metsäkone voi ylittää sen.
                            Yksi tukki painaa 50kg.`,
        onewayDescription: `Tällä työskentelyalueella on yksisuuntainen tie. Nuolet osoittavat kulkusuunnan.`,
        fogDescription: `Tällä työskentelyalueella on sumuinen sää, joka rajoittaa näkyvyyttä.`,
      },
      controls: {
        controls: "Kontrollit",
        controls1: "1. Käytä nuolinäppäimiä tai WASD-näppäimiä ohjataksesi metsäkonetta.",
        controls2: "2. Käytä Q- ja E-näppäimiä valitaksesi tukin tai säilön.",
        controls3: "3. Näppäimillä 1-6 voit piilottaa/näyttää tukkeja.",
        controls4: "4. Nosta tukki tai laske tukki säilöön välilyönnillä.",
        controls5: "5. Vaihtoehtoisesti käytä hiiren vasenta näppäintä tukin nostamiseen tai laskemiseen.",
        controls6: "6. Pidä hiiren oikeaa näppäintä pohjassa ja vedä hiirtä liikuttaaksesi kameraa.",
        controls7: "7. Zoomaa sisään tai ulos hiiren keskinäppäimellä. Pidä pohjassa ja vedä hiirtä liikuttaaksesi kameraa."
      },
      editor: {
        editor: "Editori",
        roadtoolMenu: "Tietyökalu",
        logstoolMenu: "Tukkityökalu",
        deposittoolMenu: "Säilötyökalu",
        trucktoolMenu: "Metsäkonetyökalu",
        removetoolMenu: "Poistotyökalu",
        roadtool: `Tietyökalulla voidaan tehdä teitä klikkaamalla haluttuun aloituspisteeseen, sekä haluttuun päätepisteeseen.
                   Tuplaklikkauksella poistetaan tietyökalun valinta. Erikoistiet voidaan myös asettaa tietyökalulla.`,
        logstool: `Tukkityökalulla asetetaan tukkeja haluttuun paikkaan työskentelyalueella.`,
        deposittool: `Säilötyökalulla asetetaan keräyspisteitä työskentelyalueelle.`,
        trucktool: `Metsäkonetyökalulla laitetaan työkone haluttuun aloituspisteeseen. Hiiren oikealla painikkeella käännetään metsäkone.`,
        removetool: `Poistotyökalulla voidaan poistaa objekteja työskentelyalueelta.`,
      }
    }
  },


  // Add new languages here
}
