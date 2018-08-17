loadAPI(2);
host.setShouldFailOnDeprecatedUse(true);

host.defineController("ROLI - Flavio", "ROLI + 5 Device Focused Macros (dflt ROLI)", "2.0", "c5f632e0-a22b-11e8-b568-0800200c9a66");
host.defineMidiPorts(1, 1);
host.setShouldFailOnDeprecatedUse(true);

var LOWEST_CC = 1;
var HIGHEST_CC = 123;

var DEVICE_START_CC = 107;
var DEVICE_END_CC = 115;
var DEVICE_CC_LIST = [107,109,111,113,114];

function init()
{
  host.getMidiInPort(0).setMidiCallback(onMidi);
  host.getMidiInPort(0).setSysexCallback(onSysex);
  generic = host.getMidiInPort(0).createNoteInput("", "??????");
generic.setUseExpressiveMidi(true, 0, 48);
  generic.setShouldConsumeEvents(false);
  
  var bendRanges = ["12", "24", "36", "48", "60", "72", "84", "96"];
  bendRange = host.getPreferences().getEnumSetting("Bend Range", "MIDI", bendRanges, "48");
  bendRange.addValueObserver(function (range)
   {
      var pb = parseInt(range);
      generic.setUseExpressiveMidi(true, 0, pb);
      sendPitchBendRangeRPN(1, pb);
   });
	// Set POLY ON mode with 15 MPE voices
   sendChannelController(0, 127, 15);
	
// device = host.createEditorCursorDevice();
// device=host.CursorTrack.createCursorDevice();
	
	
  transport = host.createTransport();

	// Map CC 20 - 27 to device parameters

	cursorTrack = host.createCursorTrack(3, 0);
	cursorDevice = cursorTrack.createCursorDevice();
	remoteControls = cursorDevice.createCursorRemoteControlsPage(8);

	for ( var i = 0; i < 5; i++)
	{
		var p = remoteControls.getParameter(i).getAmount();
		p.setIndication(true);
		p.setLabel("P" + (i + 1));
	}
    
    // associated the ROLI slider LEDs to the focused device parameters.
	p=remoteControls.getParameter(0).getAmount()
	p.value().addValueObserver(128, function(value) {setSliderValueLED(0,value)});
	p=remoteControls.getParameter(1).getAmount()
	p.value().addValueObserver(128, function(value) {setSliderValueLED(1,value)});
	p=remoteControls.getParameter(2).getAmount()
	p.value().addValueObserver(128, function(value) {setSliderValueLED(2,value)});
	
	// Make the rest freely mappable
	userControls = host.createUserControls(HIGHEST_CC - LOWEST_CC + 1 - 8);

	for ( var i = LOWEST_CC; i < HIGHEST_CC; i++)
	{
		if (!isInDeviceParametersRange(i))
		{
			var index = userIndexFromCC(i);
			userControls.getControl(index).setLabel("CC" + i);
			
		}
	}
}

function isInDeviceParametersRange(cc)
{
    return cc >= DEVICE_START_CC && cc <= DEVICE_END_CC;
    // if (cc in DEVICE_CC_LIST) return(cc)
}

function userIndexFromCC(cc)
{
	if (cc > DEVICE_END_CC)
	{
		return cc - LOWEST_CC - 8;
	}

	return cc - LOWEST_CC;
}

function onMidi(status, data1, data2)
{
	if (isChannelController(status))
	{
		if (isInDeviceParametersRange(data1))
		{
            var index = data1 - DEVICE_START_CC;
            var rindex = 0;
            if (data1 == 107) {rindex = 0;}
            if (data1 == 109) {rindex = 1;}
            if (data1 == 111) {rindex = 2;}
            if (data1 == 113) {rindex = 3;}
            if (data1 == 114) {rindex = 4;}
             
			remoteControls.getParameter(rindex).getAmount().value().set(data2, 128);
		}
		else if (data1 >= LOWEST_CC && data1 <= HIGHEST_CC)
		{
			var index = userIndexFromCC(data1);
			userControls.getControl(index).value().set(data2, 128);
			
		}
	}
}

function onSysex(data) {
   // MMC Transport Controls:
   switch (data) {
      case "f07f7f0605f7":
         transport.rewind();
         break;
      case "f07f7f0604f7":
         transport.fastForward();
         break;
      case "f07f7f0601f7":
         transport.stop();
         break;
      case "f07f7f0602f7":
         transport.play();
         break;
      case "f07f7f0606f7":
         transport.record();
         break;
   }
}

function sendPitchBendRangeRPN(channel, range)
{
   sendChannelController(channel, 100, 0); // Registered Parameter Number (RPN) - LSB*
   sendChannelController(channel, 101, 0); // Registered Parameter Number (RPN) - MSB*
   sendChannelController(channel, 38, 0);
   sendChannelController(channel, 6, range);
}

function setSliderValueLED(slider, value)
{
   sendSysex("F0 00 21 10 78 3D " + uint7ToHex(20 + slider) + uint7ToHex(Math.max(11, value)) + " F7");
}
function exit()
{
}
