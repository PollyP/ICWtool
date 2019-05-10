# ICWtool

ICWtool is a Chrome extension for extracting in common with (shared matches) match data from Ancestry.com DNA match pages.
The output is a downloaded comma-delimited file that you can use as an input to the processing and
visualization tools of your choice for further analysis.

To learn more about Ancestry.com's in common with feature, [see Blaine Bettinger's write-up](https://thegeneticgenealogist.com/2015/08/28/ancestrydna-announces-new-in-common-with-tool/). Blaine Bettinger also has a great post about [using Ancestry.com's ICW data for clustering analysis, and details some of the pitfalls to watch out for](https://thegeneticgenealogist.com/2017/01/03/clustering-shared-matches/).

## Overview

To use ICWtools, install it in your Chrome browser, and then navigate to your Ancestry.com DNA Matches page.
The ICWtools download icon to the right of Chrome's omnibox (the browser address bar) should become active.
Click on the icon to bring up a popup. Click on the "get ICW data" button. Soon you should see a downloaded .csv file
in your Downloads folder. Go to the next set of Ancestry DNA match results, and repeat to get the in common with 
data for those matches.

## Installation

ICWtools is only available as source code on Github, a code repository for software developers. Here's how to install it:

1. Download ICWTools from https://github.com/PollyP/ICWtool. Most non-developers will want to download the ZIP file. 
To do that, click the big green button labelled "Clone or Download," then pick "download ZIP."
Find the ZIP file in your Downloads folder and open it and extract the files to a location of your choice.

2. Install ICWTools in your Chrome browser. Do this by entering "chrome://extensions" in Chrome's omnibox.
On the extensions page, look for the "Developer mode" button on the upper right. Enable developer mode by
moving the button to the right.  Some buttons on the upper left of the extensions will become visible. 
Click the "Load unpacked" button and navigate to the location
where you unzipped ICWtools. Click select. You should now see ICWtools in your Chrome extensions list.

3. The ICWtools icon, an arrow pointing down, will appear to the right of the Chrome omnibox. 
With your active tab still pointing at the extensions page, the icon will be grayed out, because it is disabled. 
ICWtools is enabled only on your Ancestry.com DNA Matches page.
Sign in to Ancestry.com and navigate to your DNA matches page now. The ICWtools icon will become blue, indicating
that ICWtools is available.

## Use

To use ICWtools, navigate to your Ancestry.com DNA matches page and click on the ICWtools icon to the right of the
Chrome omnibox to bring up the ICWtools popup. Click on "get ICW matches" to get the in common with data for matches
on the page. When all the data has been collected, it is put into a CSV-formatted file and downloaded to your Downloads folder.
To get data for the next page, advance to the next page and repeat the process.

The file output will consist of a few comment rows about how the file was produced, a row describing the
column headers, and rows for each in common with person found. Here's what's in each column:

- User display name. This is the display name of the original DNA test taker.
- User GUID. This is the GUID (identification string) Ancestry.com uses to identify the test taker.
- Results page number. The DNA Match page number this row's data was extracted from.
- Match Name. The display name of the original DNA test taker's match.
- Match GUID. The GUID (identification string) Ancestry.com uses to identify the DNA test taker's match.
- Match Centigrams. How much DNA the original DNA test taker and the match share.
- ICW Name. The display name of the person who shares DNA with both the original test taker and the match.
- ICW Guid. The GUID (identification string) Ancestry.com uses to identify the ICW person.
- ICW Gender. The gender of the ICW person.
- ICW Centimorgans. The amount of centimorgans the original test taker and the ICW person share.
- ICW Num Segments. The number of segments the original test taker and the ICW share.
- ICW Starred. A flag that indicates if the original test taker has starred the ICW person.
- ICW note. Displays the note that the original test taker added to the ICW person, if it exists.

Note that the ICW's person shared DNA data is *relative to the original test taker*. Ancestry doesn't give
users any data on the amount of shared DNA between the original test taker's match and the ICW person --
unless you have access to either of those kits, of course.

## Support

ICWtools is a tool I wrote for my own use, and I'm making it available for anyone else who wants to use it.
But my work on ICWtools is strictly on a time-available basis, so I am not making any promises about support
and maintenance. 

As long as I'm caveating: Since ICWtools is a Chrome extension, it is completely dependent on Ancestry.com's website. Websites
change how they do things all the time, and any of those changes could make ICWtools inoperable for
a time, or even permanently.

That said, do feel free to file issues on [ICWtool's Github issue tracker page](https://github.com/PollyP/ICWtool/issues).
Developers:  Pull Requests are entirely welcome.

## Uninstalling ICWtools

To uninstall ICWtools, enter "chrome://extensions" in Chrome's omnibox. Find ICWtools in the list, and
click the "Remove" box next to it.

## Privacy Policy

ICWtools interacts only with the Ancestry.com website and your computer. It does not communicate
with any third party websites (e.g., there's no tracking code in the extension). Aside from the generated CSV file, it does not store any information.

I urge you to not take my word for any of it and [examine the source code for yourself](https://github.com/PollyP/ICWtool).

## License

ICWtools is made available under the (GNU General Public License v3.0)[https://choosealicense.com/licenses/gpl-3.0/].
The TL;DR of this license is that (1) anyone can use, copy and modify this code, but (2) if you are thinking of redistributing this
code (say, as part of a commercial product), the GPLv3.0 license imposes additional requirements that you
should [carefully consider](https://choosealicense.com/licenses/gpl-3.0/).





