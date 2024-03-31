const { SlashCommandBuilder } = require('@discordjs/builders');
var Discord = require('discord.js');
const lib = require('../lib');

const cooldown = 1000 * 60 * 5; // 5 minutes
let lastRun = 0;

const ent_pre = `aiscripted,ambient,ammo,button,cycler,env,func,game,info,item,light,momentary,monster,multi,path,player,scripted,target,trigger,weapon,world,xen`.split(',');
const ent_suf = `sequence,generic,9mmclip,9mmAR,9mmbox,ARgrenades,buckshot,357,rpgclip,gaussclip,crossbow,target,sprite,weapon,wreckage,beam,beverage,blood,bubbles,explosion,global,glow,fade,funnel,laser,message,render,shake,shooter,sound,spark,breakable,button,conveyor,door,door_rotating,friction,guntarget,healthcharger,illusionary,ladder,monsterclip,mortar_field,pendulum,plat,platrot,pushable,recharge,rot_button,rotating,tank,tankcontrols,tanklaser,tankrocket,tankmortar,trackautochange,trackchange,tracktrain,traincontrols,train,wall,wall_toggle,water,counter,counter_set,end,player_equip,player_hurt,player_team,score,team_master,team_set,text,zone_player,bigmomma,intermission,landmark,node,node_air,null,player_coop,player_deathmatch,player_start,teleport_destination,airtank,antidote,battery,healthkit,longjump,security,suit,spot,environment,alien_controller,alien_grunt,alien_slave,apache,babycrab,barnacle,barney,barney_dead,bloater,bullchicken,cockroach,flyer_flock,furniture,gargantua,gman,grunt_repel,handgrenade,headcrab,hevsuit_dead,hgrunt_dead,houndeye,human_assassin,human_grunt,ichthyosaur,leech,miniturret,nihilanth,osprey,rat,satchelcharge,scientist,scientist_dead,sitting_scientist,sentry,snark,tentacle,tripmine,turret,zombie,manager,corner,track,loadsaved,weaponstrip,sentence,cdaudio,auto,autosave,camera,changelevel,changetarget,endsection,gravity,hurt,monsterjump,multiple,once,push,relay,teleport,transition,crowbar,9mmhandgun,shotgun,rpg,gauss,egon,satchel,hornetgun,items,plantlight,hair,tree,spore_small,spore_medium,spore_large`.split(',');
const ent_key = `message,skyname,sounds,light,WaveHeight,MaxRange,chaptertitle,startdark,gametitle,newunit,mapteams,defaultteam,sequence,zhlt_lightflags,light_origin,_fade,_falloff,spawnflags,angles,targetname,target,globalname,delay,killtarget,renderfx,rendermode,renderamt,rendercolor,TriggerTarget,TriggerCondition,UseSentence,UnUseSentence,m_iGibs,m_flVelocity,m_flVariance,m_flGibLife,_light,style,pattern,health,material,explosion,gibmodel,spawnobject,explodemagnitude,speed,master,movesnd,stopsnd,wait,lip,dmg,netname,locked_sound,unlocked_sound,locked_sentence,unlocked_sentence,_minlight,yawrate,yawrange,yawtolerance,pitchrate,pitchrange,pitchtolerance,barrel,barrely,barrelz,spritesmoke,spriteflash,spritescale,rotatesound,firerate,bullet_damage,persistence,firespread,minRange,maxRange,volume,height,rotation,train,toptrack,bottomtrack,m_iszEntity,m_iszPlay,m_flRadius,m_flRepeat,m_fMoveTo,m_iFinishSchedule,preset,volstart,fadein,fadeout,pitch,pitchstart,spinup,spindown,lfotype,lforate,lfomodpitch,lfomodvol,cspinup,model,framerate,scale,LightningStart,LightningEnd,Radius,life,BoltWidth,NoiseAmplitude,texture,TextureScroll,framestart,StrikeTime,damage,skin,color,amount,density,frequency,current,iMagnitude,globalstate,triggermode,initialstate,duration,holdtime,LaserTarget,width,EndSprite,messagesound,messagevolume,messageattenuation,amplitude,radius,shootmodel,shootsounds,roomtype,MaxDelay,distance,modifier,m_flSpread,m_iCount,m_fControl,m_iszXController,m_iszYController,damp,size,friction,buoyancy,changetarget,fanfriction,spawnorigin,bullet,laserentity,wheels,startspeed,bank,avelocity,frags,points,triggerstate,teamindex,x,y,effect,color2,fxtime,channel,intarget,outtarget,incount,outcount,reachdelay,reachtarget,reachsequence,presequence,_cone,_cone2,_sky,returnspeed,pose,iFlockSize,flFlockRadius,body,weapons,orientation,sweeparc,sound,monstertype,monstercount,m_imaxlivechildren,yaw_speed,altpath,messagetime,loadtime,sentence,entity,refire,listener,attenuation,m_iszIdle,moveto,acceleration,deceleration,map,landmark,changedelay,m_iszNewTarget,count,section,gravity,damagetype,type`.split(',');
const ent_val = `1,4096,0,1.0,0 0 0,3,200,0.15,4,255 255 128 200,100,30,180,15,5,0.85,512,10,10.0,sprites/fire.spr,256,20,sprites/laserbeam.spr,35,2,sprites/glow01.spr,255,500,2.5,-1,128,90,64,50,21,-3,3.2,999,100 100 100,240 110 0,1.5,0.5,1.2,0.25,45,-90,8,44,11,13,37,73,130,40,42`.split(',');
const tex_names = `NULL,AAATRIGGER,BEVEL,CLIP,ORIGIN,+0~GYMLIGHT,CRATE07,BABTECH_BORDL7,TNNL_GAD4,C1A1DOOREDGE,+1LAB1_COMP9B2,-2OUT_GRND2B,SUBWAY_OUTEND,-1FIFTIES_F01,GENERIC001,LAB1_BRD10,FIFTIES_BORD06,C1A1W1F,SIGN41,LAB1_W6,+0~LAB1_CMP2,XCRATE12B,C2A5MOUND3,-1CRETE2_FLR5,LAB1_W10B,PINUPXENA1,WET_WALL04,+2LAB1_COMP9A2,C3A2A_TNK3B,CARDBOXTOP2,GENERIC106A,SIGN78,+0LAB_COMPM4,CLOCK1,C3A2A_BRD1A,+0FLICKERMON,+0LAB1_W7,-3FIFTIES_F03B,C2A4_CONV2,ARMSIDES,C1A1_NAMES11,-2OUT_DIRT2,+A~ELEV1_PAN,SIGNC3A1_2H,GENERIC103C,OUT_WALL7F,GLASS_MED,TNNL_W13E,CA1X_C1D,TNNL_W6_2,+0C1A4_SWTCH5,C3A2B_REAC1B,SIGN71,BABTECH_BORDL5,+0~LIGHT1,TRK_INDOOR,LAB1_STAIR1B,OUT_W6D,C3A1_CRATE2,C2A4_H2E,+0LAB1_COMP9B,OUT_W1C,SUBWAY_SEAT,BABTECH8A,C3A1_DGRE1B,-0OUT_W5B,METAL_WALL05D,CRETE4_WALL01,LAB1_GLU2,SIGN8,C1A0_FLIPSIGN5,C2A4_SGN1A,SIGN35,+0BUTTON3,METAL_BORD08,XCRATE8C,-0OUT_WALL3,-0TNNL_W13A,-0OUT_W4,FROSTSLICK,C1A1_NAMES3,LAB1_COMP3D,GENERIC86,+ATNNL_GAD2,FIFTIES_MON1B,-0OUT_RK3,-2SILO2_C1,C1A3_W2A,DRKMTLT_BORD08,+ATRRM_TRG1,C3A2_BTH2B,TNNL_W12D,C3A2SIGN34,C2A2A_LIFT1,LAB1_PANEL1,+4LAB1_CMPM1,C3A1_W3C,SILO2_WALL2A,SIGNC1A1_1,+3~C2A4_SGN1,C2A5DEADCOMP1,TNNL_C3B,C3A2A_W2C,STAIRSRT,TNNL_FLR3C,TNNL_W5,C1A4I_W1C,C3A2SIGN17,+0LAB1_COMP9A2,C1A4_PAN1A,-1CRETE4_FLR1,+0~GENERIC78B,POSTER15,GENERIC025,CON1_BORD02,TRAIN3,LAB1_SLOT4B,-1CA1X_C1,-2TNNL_FLR7,{GRATE4A,-1BABFL,TRAIN2,XCRATE4B,BARREL4,SILO2_PAN3A,DUCT_WALL03,SIGN79,FIFTIES_WALL13B,-1C2A4_COR2,C1A3SECDR02,BABTECH_DR2E,C2A2_SIG1C,SIGNC3A1_2G,C3A2_LIGHT2,LAB1_W8O,BABTECH9C,~LIGHT5A,GENERIC92,GENERIC101F,{TENSION5,C1A3WALL03,+1~LAB_CRT2,CA1X_SUP5C,+0CA1X_BRD2,+2~LAB_CRT5,UC_SIDE,C1A1_NAMES2,OUT_TNT1B,C2A1_W2,-1SILO2_FLR11,XCRATE2E,FREEZER_BX2,C2A4_H2C,FLATBED_POD,C3A2SIGN22,FIFTIES_MON3B,C2A4XC2,FIFTIES_CEIL01,LAB1_GAD1,FIFTIES_DR5B,LAB1_FLR5D,{TENSION6,GENERIC52,C2A5_INTK3,C1A0_LABW6,TNNL_FLR4B,-2C1A4_W6,+A~GENERIC85,OUT_WALL1D,+0RECHARGE,LAB1_FLR6B,PEPSI_SD,CA1X_MONSIDE,C2A4_FLR3,C1A0B_PAN2,CA1X_PCFRONT,OUT_TNT3B,GENERIC106,LAB1_PANELE,-2FREEZERC4,+0~GENERIC78D,+1LASER1FALL,-0CRETE4_WALL01,-3OUT_RK3,FIFTIES_WALL13D,OUT_GRVL2B,C1A1_LAIDLAW3,+ALAB1_W6B,OUT_DMPLID,C3A2B_REAC3,C3A2SIGN55,SIGNC1A3_1,FIFTIES_GGT7B,DUCT_FLR02,FIFTIES_DR1,AMMO04,-1OUT_GRND3,-1FIFTIES_W06,C1A4B_W2,C1A4_DOME,{RUSTYRUNGS,FIFTIES_WALL12,~LAB_CRT11A,BABTECH_DR4C,ROCKETCHROME`.split(',');
const tex_normals = `0 0 1,0 0 -1,0 1 0,0 -1 0,1 0 0,-1 0 0`.split(',');

const templates = [
`{
"classname" "<ent_prefix>_<ent_suffix>"
"<ent_key>" "<ent_val>"
"<ent_key>" "<ent_val>"
"<ent_key>" "<ent_val>"
"<ent_key>" "<ent_val>"
"<ent_key>" "<ent_val>"
}`,
`{
"classname" "<ent_prefix>_<ent_suffix>"
"<ent_key>" "<ent_val>"
"<ent_key>" "<ent_val>"
"<ent_key>" "<ent_val>"
{
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
}
}`,
`{
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) ( <coord> <coord> <coord> ) <texture_name> [ <texture_normal> 0 ] [ <texture_normal> 0 ] <rotation> <scale> <scale>
}`
];

function generateResult() {
    /** @type string */
    const template = lib.choose(templates);
    return template.replace(/<([^>]+?)>/img, (match, name) => {
        let rand = [name];
        switch (name) {
            case 'ent_prefix':
                rand = ent_pre;
                break;
            case 'ent_suffix':
                rand = ent_suf;
                break;
            case 'ent_key':
                rand = ent_key;
                break;
            case 'ent_val':
                rand = ent_val;
                break;
            case 'coord':
                return (Math.random() * 512).toFixed(5);
            case 'texture_name':
                rand = tex_names;
                break;
            case 'texture_normal':
                rand = tex_normals;
                break;
            case 'rotation':
                return (Math.random() * 360).toFixed(0);
            case 'scale':
                return (0.5 + Math.random() * 2).toFixed(2);
        }
        return lib.choose(rand);
    })
}

module.exports = {
    name: 'mapgpt',
    description: 'MapGPT: An advanced machine learning generative AI to generate maps',
    slash: true,
    /**
     * 
     * @param {SlashCommandBuilder} builder 
     */
    addOptions(builder) {
        builder.addStringOption(r => r
            .setName('prompt')
            .setDescription('Insert a descriptive prompt for the AI')
            .setRequired(true)
        );
    },
    /**
     * @param {Discord.Interaction<Discord.CacheType>} interaction 
     */
    async executeSlashCommand(interaction) {
        const bot = interaction.client;
        if (bot.silenced === true) return;

        const production = interaction.guild.id === '291678871856742400';
        
        if (production && interaction.channel.name !== 'shoutbox-live') {            
            await interaction.reply({ content: 'Please only run MapGPT in the #shoutbox-live channel.', ephemeral: true });
            return;
        }

        const now = +new Date();
        const nextAllowedRun = lastRun + cooldown;
        if (production && nextAllowedRun > now) {
            await interaction.reply({ content: 'MapGPT is limited to 1 request per 5 minutes to reduce server costs. Please try again later.', ephemeral: true });
            return;
        }
        lastRun = now;

        const prompt = interaction.options.getString('prompt', true);
        let result = `<@${interaction.user.id}>, thank you for using MapGPT!\nHere is your content, inspired by your prompt of ${'`'+prompt+'`'}:\n`
            + '```\n'
            + generateResult()
            + '\n```\n'
            + `Please note that while our advanced algorithms try as hard as possible to be correct, they occasionally make mistakes. As such, this content comes with absolutely no warranty. `
            + `Also note our terms of use and privacy policy. Using this content in any map incurs a fee of $20 for each download or install of your work.`;

        await interaction.reply({ content: result });
    }
};