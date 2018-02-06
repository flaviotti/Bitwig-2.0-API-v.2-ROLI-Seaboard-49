# Bitwig-2.0-API-v.2-ROLI-Seaboard-49
Controller scripts for ROLI seaboard 49 for Bitwig Studio 2.x. Compared to the one provided by the DAW, this script enable the 3 sliders and XY pad to control the first 5 parameters of the device page in focus. 

INSTALLATION:
Install the .js file under 
  Windows:        %USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\
  Mac and Linux:  ~/Bitwig Studio/Controller Scripts/

From Bitwig, under the setting/controller page, disable or (better) get rid of the controller already associated (removing by clicking the X icon won't delete the actual controller)
click on "select controller manually" and select "ROLI Flavio")
set Input and Output to the ROLI Seaboard device. The picth bend range should be already appearing at 48.

Open the ROLI Dashboard.
set the midi CC Mapping for slide 1, 2 and 3 with CC20 (should be already set), CC21 and CC22 respectively.
set the midi CC Mapping for X and Y of the pad to CC23 and CC24.
