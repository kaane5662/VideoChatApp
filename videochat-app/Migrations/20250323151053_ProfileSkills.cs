using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace videochat_app.Migrations
{
    /// <inheritdoc />
    public partial class ProfileSkills : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Experience",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string[]>(
                name: "Skills",
                table: "Profiles",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Timezone",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Experience",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Skills",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Timezone",
                table: "Profiles");
        }
    }
}
